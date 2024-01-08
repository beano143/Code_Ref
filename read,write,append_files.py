file_path = 'file.txt'

# reads the file
with open(file_path, 'r') as file:
  for line in file:
    print(line)

# writes and replaces the data 
with open(file_path, 'w') as file:
  file.write("some info")

# appends data to the file
with open(file_path, "a") as file:
  file.write("\n now with some more data")

