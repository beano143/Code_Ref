file_path = 'file.txt'

# reads the file
with open(file_path, 'r') as file:
  for line in file:
    print(line)

# writes to the file
with open(file_path, 'w') as file:
