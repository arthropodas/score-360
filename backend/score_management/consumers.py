

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
import jwt
import asyncio
import json
from score_management import models
from django.db import transaction
from asgiref.sync import sync_to_async
from .models import deliveries
from match_management.models import Matches, PlayingSquad
from django.conf import settings
from django.core.exceptions import ValidationError
from usermanagement.models import UserData
from .validators import validate_innings_no,validate_overs,validate_striker,validate_bowler,validate_match_id,validate_extras,validate_players_ids,validate_striker_non_striker_bowler_fielder,validate_non_striker,validate_runs,validate_match_started_ended, validate_batting_bowling,validate_wicket,validate_players, validate_ball_count, validate_player_out,validate_innings_started, validate_team, validate_team_in_match
from collections import Counter
from .utils import calculate_eco, process_current_over,update_match_status
def remove_square_brackets(json_string):
    updated_data = {key: value[0] for key, value in json_string.items()}
    return updated_data

class AddScoreConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = None
        self.delivery = None
        self.token = None
        self.match_id = None
        self.string_result = None
        self.active_status = [3,4,5,6]

    async def connect(self):
        try:
            
            query_params = parse_qs(self.scope['query_string'].decode())
            self.match_id = int(query_params.get('match_id', [None])[0])
            self.token = query_params.get('token', [None])[0]
          
          
            
           
            if self.match_id is None:
                self.group_name = "match_not_exist"
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                await self.accept()
                await self.send_error_message(error_code="9112", message="Match Id is required")
                await self.close()
               
                return  
            
            
            if self.match_id:
                self.group_name = f"match_{self.match_id}"
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                await self.accept()
                try:
                    
                    await   validate_match_id(self.match_id)
                    validate_match_started_ended(self.match_id)
                    

                except ValidationError as e:
                    error_dict = remove_square_brackets(e.message_dict)
                   
                    await self.send_error_message(error_code=error_dict['errorCode'], message=error_dict['message'])
                    await self.close()
                    return 

                
            else:
                await self.close()

            try:
                if self.token:
                    payload = jwt.decode(self.token, settings.SECRET_KEY, algorithms=["HS256"])
                    self.user_id = payload['user_id']
               
            except jwt.exceptions.InvalidTokenError:
             
                await self.send_error_message(error_code="9150", message="Invalid token")
                await self.close()
        
            
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            
            await self.send_error_message(error_code=error_dict['errorCode'], message=error_dict['message'])


        
    
    async def send_error_message(self, error_code, message):
        await self.send(text_data=json.dumps({'errorCode': error_code, "message": message}))

    

    async def disconnect(self, close_code):
        if self.match_id:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        if not text_data:
            
           
            await self.send_error_message(error_code="9152", message="Input is null")
            return
        match = Matches.objects.get(id = self.match_id, status__in =self.active_status)
        match_creator = match.tournament.user.id
        
        
        if self.user_id is None or self.user_id != match_creator:
            await self.send_error_message(error_code="9120", message="This user is not authorized to do this action.")
            return

     
        
        try:
            data_json = json.loads(text_data)
        except json.JSONDecodeError as e:
    
            await self.send_error_message(error_code="400", message="Invalid JSON format")
            return
    
        delivery_data = data_json['data']
        deliveries = {
            'innings_no': delivery_data.get('inningsNo'),
            'runs': delivery_data.get('runs'),
            'extras': delivery_data.get('extras'),
            'type_of_extras': delivery_data.get('typeOfExtras'),
            'wicket': delivery_data.get('wicket'),
            'type_of_dismissal': delivery_data.get('typeOfDismissal'),
            'batting_team_id': delivery_data.get('battingTeam'),
            'bowler_id': delivery_data.get('bowlerId'),
            'bowling_team_id': delivery_data.get('bowlingTeam'),  
            'dismissed_by_fielder_id': delivery_data.get('dismissedByFielder'),
            'striker_id': delivery_data.get('striker'),
            'non_striker_id': delivery_data.get('nonStriker'),
            'over_no':delivery_data.get('overNo')
        }

        try:
          
            validate_innings_no(deliveries['innings_no'])
            
            validate_striker(deliveries['striker_id'])
            validate_bowler(deliveries['bowler_id'])
            validate_non_striker(deliveries['non_striker_id'])
            validate_runs(deliveries['runs'])
            validate_batting_bowling(deliveries['batting_team_id'], deliveries['bowling_team_id'])
            validate_bowler(deliveries['bowler_id'])
            validate_extras(deliveries['extras'], deliveries['type_of_extras'])
            validate_overs(deliveries['over_no'])
            
            
            players = [deliveries['striker_id'], deliveries['non_striker_id'], deliveries['bowler_id'],deliveries['dismissed_by_fielder_id']]
            
            
            match = await sync_to_async(Matches.objects.get)(id = self.match_id, status__gte=1)
            innings_no = deliveries['innings_no']

            if(await validate_players_ids(self,self.match_id, innings_no, players)):
                return 
           
            
            validate_striker_non_striker_bowler_fielder(deliveries['striker_id'], deliveries['non_striker_id'],deliveries['bowler_id'],deliveries['dismissed_by_fielder_id'])

      
           
      
            match_over = match.number_of_overs
            wicket = deliveries['wicket']
            over_no = deliveries['over_no']
            innings_no = deliveries['innings_no']
       
            type_of_dismissal = deliveries['type_of_dismissal']
         
            dismissed_by_fileder_id = deliveries['dismissed_by_fielder_id']
            runs=deliveries['runs']

            
           
            validate_wicket(wicket=wicket, type=type_of_dismissal,fielder=dismissed_by_fileder_id,runs=runs)
           
           
            if( await validate_ball_count(self,match_id=self.match_id,over_no=over_no,innings_no=deliveries['innings_no'],match_over =match_over)):
                return
            if(await validate_team_in_match(self,batting_team =deliveries['batting_team_id'],bowling_team=deliveries['bowling_team_id'], match_id = self.match_id)):
        
                return
                     
            
            over_no = deliveries['over_no']
            innings_no = deliveries['innings_no']
            match_over = match.number_of_overs

            
            if await validate_innings_started(self, innings_no=innings_no,match_id=self.match_id,):
                return

          
            action_type = data_json.get('type')
          

            if action_type in ('add_score', 'undo_score'):
                result =  self.update_score(data_json,action_type)
            
                if not isinstance(result, str):
                    self.string_result = result
    
            
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "send_score",
                        "message": self.string_result
                    }
                )

        except ValidationError as e:
           
            error_dict = remove_square_brackets(e.message_dict)
          
            await self.send_error_message(error_code=error_dict['errorCode'], message=error_dict['message'])
            return 

    async def send_score(self, event):
      
        message = event['message']
       
        await self.send(text_data=json.dumps(str(message)))

    def update_score(self, data_json, action_type):
    

  
        if self.token is None:
            return "The public user cannot have permission to update."

        delivery_data = data_json.get('data', {})
    
        try:
            
            innings_no = delivery_data.get('inningsNo')
            runs = delivery_data.get('runs')
            extras = delivery_data.get('extras')
            wicket = delivery_data.get('wicket')
            type_of_dismissal = delivery_data.get('typeOfDismissal')
            type_of_extras = delivery_data.get('typeOfExtras')
            batting_team_id = delivery_data.get('battingTeam')
            bowler_id = delivery_data.get('bowlerId')
            bowling_team_id = delivery_data.get('bowlingTeam')
          
            dismissed_by_fielder_id = delivery_data.get('dismissedByFielder')
            striker_id = delivery_data.get('striker')
            non_striker_id = delivery_data.get('nonStriker')
            over_no = delivery_data.get('overNo')
            if action_type == 'undo_score':
           
               
                latest_delivery = deliveries.objects.filter(status=1, match_id=self.match_id).order_by('-id').first()
                if latest_delivery:
                    
                        latest_delivery.status = 0
                        latest_delivery.save()
                       
        
            else:
               
                with transaction.atomic():
                    self.delivery = deliveries.objects.create(
                        innings_no=innings_no,
                        runs=runs,
                        extras=extras,
                        wicket=wicket,
                        type_of_dismissal=type_of_dismissal,
                        type_of_extras=type_of_extras,
                        batting_team_id=batting_team_id,
                        bowler_id=bowler_id,
                        bowling_team_id=bowling_team_id,
                    
                        dismissed_by_fielder_id=dismissed_by_fielder_id,
                        match_id=self.match_id,
                        striker_id=striker_id,
                        non_striker_id=non_striker_id,
                        over_no=over_no
                    )
        
            match=Matches.objects.get(id=self.match_id)
            update_match_status(match_id=self.match_id,innings_no=innings_no,over_no=over_no,tournament_id=match.tournament.id,team_one_id=batting_team_id,team_two_id=bowler_id)
            match_deliveries = deliveries.objects.filter(
               match_id=self.match_id, status=1, innings_no=innings_no
           )

        
            match_deliveries = deliveries.objects.filter(match_id=self.match_id, status=1,innings_no = innings_no)

            
            team_total = sum(delivery.runs + 1 if delivery.type_of_extras in [1, 2] else delivery.runs for delivery in match_deliveries)

            team_wickets = match_deliveries.filter(wicket=1).count()
         
           
            balls_bowled = len(match_deliveries.exclude(type_of_extras__in=[1, 2]))
           
            runs_conceded = team_total
            team_overs = balls_bowled // 6 + (balls_bowled % 6) / 10
            crr = (runs_conceded / balls_bowled) * 6 if balls_bowled > 0 else 0

            batter_one = match_deliveries.filter(striker_id=striker_id)
            batter_one_data = UserData.objects.get(id=striker_id)
            batter_one_name = batter_one_data.first_name + " " + batter_one_data.last_name
           
            
            batter_one_ballfaced = len(batter_one.exclude(type_of_extras__in=[1, 2])) 

            
            batter_one_runs = sum(delivery.runs for delivery in batter_one.exclude(type_of_extras__in=[3, 4]))

            batter_one_fours = batter_one.filter(runs=4).exclude(type_of_extras__in=[3, 4]).count()
            batter_one_sixes = batter_one.filter(runs=6).count()
            batter_one_sr = (batter_one_runs / batter_one_ballfaced) * 100 if batter_one_ballfaced > 0 else 0

            batter_two_stats = match_deliveries.filter(striker_id=non_striker_id)
            batter_two_data = UserData.objects.get(id=non_striker_id)
            batter_two_name = batter_two_data.first_name + " " + batter_two_data.last_name
            batter_two_ballfaced = len(batter_two_stats.exclude(type_of_extras__in=[1, 2]))  
            batter_two_runs = sum(delivery.runs for delivery in batter_two_stats.exclude(type_of_extras__in=[3, 4]))      
            batter_two_fours = batter_two_stats.filter(runs=4).count()
            batter_two_sixes = batter_two_stats.filter(runs=6).count()
            batter_two_sr = (batter_two_runs / batter_two_ballfaced) * 100 if batter_two_ballfaced > 0 else 0

            bowler_stats = match_deliveries.filter(bowler_id=bowler_id)
            bowler_details = UserData.objects.get(id=bowler_id)
            no_of_wickets = len(bowler_stats.filter(wicket=1)) 
            bowler_name = bowler_details.first_name+" "+bowler_details.last_name
            runs_conceded= sum(delivery.runs for delivery in bowler_stats.exclude(type_of_extras__in=[3, 4]))
            runs_conceded = sum(delivery.runs for delivery in bowler_stats)
            bowler_over = len(bowler_stats.exclude(extras=1,type_of_extras__in=[1, 2]))


            batter_stats1 = {
                'runs': batter_one_runs,
                'fours': batter_one_fours,
                'sixes': batter_one_sixes,
                'ballsFaced': batter_one_ballfaced,
                'strikeRate':round(batter_one_sr,2),
                'name': batter_one_name,
            }

            batter_stats2 = {
                'runs': batter_two_runs,
                'fours': batter_two_fours,
                'sixes': batter_two_sixes,
                'ballsFaced': batter_two_ballfaced,
                'strikeRate': round(batter_two_sr,2),
                'name': batter_two_name
            }
        
           

            current_over_deliveries = deliveries.objects.filter(
            match_id=self.match_id,
            status=1,
            over_no=over_no,
            innings_no=innings_no
            )
            current_over_stats = []
            current_over_stats = process_current_over(current_over_deliveries)
            
         
            bowler_stats = {
            'balls': bowler_over // 6 + (bowler_over % 6) / 10,
            'wkts': no_of_wickets,
            "name": bowler_name,
            "runs": runs_conceded,
            "eco": calculate_eco(bowler_over, runs_conceded)
        }

        
            # Assemble match statistics
            match_stats = {
                "battingTeamId": batting_team_id,
                "bowlingTeamId": bowling_team_id,
                "teamTotal": team_total,
                "teamWickets": team_wickets,
                "teamOvers": team_overs,
                "crr": round(crr,2),
                "batterOneStats": batter_stats1,
                "batterTwoStats": batter_stats2,
                "currentOverStats": current_over_stats,
                "bowlerStats": bowler_stats,
                "inningsNo":innings_no
                
            }
            
            
            return match_stats

        except Exception:
            
            return "An error occurred while updating score"