This instruction set is to set up MPI and node creation for group remote code exicution 

------------------------------------- FOR EACH ----------------------------------------------

Install MPI 
```
apt-get install mpich 
```
if youre using python make sure that you are properly implamenting MPI4py and install python packages  
```
pip install mpi4py
```
set hostnames; yes you need to do this even when dealing 
```
hostnamectl set-hostname <rank>-<id>
```
------------------------------------- FOR MAIN ----------------------------------------------
Set Hostname resolutoion 
```
  pico /etc/hosts
    </ip>   </hostname>
```
Set Hostnames of lower rank pcs
```
pico hostfile
    <hostname of lower>
```
Create a SSH key; ssh-askpass is the file locaion that MPI will use
```
ssh-keygen -t rsa
    /usr/bin/ssh-askpass
        <>
        <>
```
Push the key to all local 
```
ssh-copy-id <username>@</hostnames>
<<verify>>
```
mod the file so it can be executed by MPI 
```
chmod 700 /usr/bin/ssh-askpass
```
Shift the default username for ssh 
```
pico /etc/ssh/ssh_config
    <ctr-W> host*
        <username>
```
------------------------------------- FOR LOWER ---------------------------------------------

Set the hostname for master pc in hosts
```
pico /etc/hosts
        <main ip> <main_hostname>
```
on /home/username
```
pico <script_name>
```
------------------------------------- RUNNING -----------------------------------------------   

on the host machine run 
```
mpiexec --hostfile < hostfile > -n <number processes>   <run type(python)> <file_name>
```


------------------------------------- ERRORS ------------------------------------------------

If there is an error in regaurd to a proxy you may have hostnames set up incorectly

problems with permisions might be rooted in file permisions of the ssh key or the defaul ssh username 
