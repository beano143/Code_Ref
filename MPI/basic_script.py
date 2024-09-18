from mpi4py import MPI
import numpy as np

# Initialize the MPI communicator
comm = MPI.COMM_WORLD
rank = comm.Get_rank()  # Get the process rank
size = comm.Get_size()  # Get the total number of processes

# Function that each process will execute
def compute_sum(arr):
    return np.sum(arr)

if __name__ == "__main__":
    # Define the total size of the data
    data_size = 1000000
    if rank == 0:
        # Create a large array of random numbers in the root process (rank 0)
        data = np.random.random(data_size)
        # Split the data into nearly equal chunks for each process
        chunks = np.array_split(data, size)
    else:
        chunks = None

    # Scatter the data chunks to each process
    local_chunk = comm.scatter(chunks, root=0)

    # Each process computes the sum of its chunk
    local_sum = compute_sum(local_chunk)

    # Gather all the local sums to the root process
    total_sum = comm.reduce(local_sum, op=MPI.SUM, root=0)

    if rank == 0:
        # Only the root process will output the result
        print(f"Total sum: {total_sum}")
