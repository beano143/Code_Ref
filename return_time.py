import time 
import os 

os.environ['TZ'] = 'EST+05EDT,M4.1.0,M10.5.0'

local_time = time.strftime('%X') # returns military time 

print(local_time)
