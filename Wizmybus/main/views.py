from django.shortcuts import render
import json
from django.http import JsonResponse
from django.conf import settings
import os

def index(request):
    return render(request, 'index.html')

def get_buses_data(request):
    BUS_JSON_PATH = os.path.join(settings.BASE_DIR, "main", "bus.json")
    with open(BUS_JSON_PATH, "r") as f:
        buses_data = json.load(f)
    return JsonResponse(buses_data, safe=False, json_dumps_params={'indent': 4})

