from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todo_collection = db['todos']

class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        try:
            todos = list(todo_collection.find({}, {"_id":0}))
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in fetching todos: {str(e)}")
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        data = request.data.get('todo')
        
        if not data:
            return Response({"error":"400 Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            todo_collection.insert_one({"todo":data})
            return Response({"message": data+" Added Successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error in adding todos: {str(e)}")
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

