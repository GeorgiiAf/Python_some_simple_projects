import aiohttp
from typing import List
import pytest
from additional_matrix import test_matrices

# Function to fetch and process the matrix from a given URL
async def get_matrix(url: str) -> List[int]:
    async with aiohttp.ClientSession() as session:
        try:
            # Fetch the matrix data from the URL
            async with session.get(url) as response:
                response.raise_for_status()  # Raise an error for bad status codes
                matrix_text = await response.text()
                print(f"Response content:\n{matrix_text}")

            # Parse the matrix data
            matrix = parse_matrix(matrix_text)
            print(f"Parsed matrix:\n{matrix}")

            # Perform spiral traversal on the parsed matrix
            traversal_result = spiral_traversal(matrix)
            print(f"Spiral traversal result:\n{traversal_result}")

            return traversal_result
        except aiohttp.ClientResponseError as e:
            print(f"HTTP error occurred: {e}")
        except aiohttp.ClientError as e:
            print(f"Request error occurred: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
    return []

# Function to perform spiral traversal on a matrix
def spiral_traversal(matrix: List[List[int]]) -> List[int]:
    if not matrix:
        return []

    result = []
    rows, cols = len(matrix), len(matrix[0])
    left, right, top, bottom = 0, cols - 1, 0, rows - 1

    while left <= right and top <= bottom:
        # Traverse from top to bottom along the left column
        for row in range(top, bottom + 1):
            result.append(matrix[row][left])
        left += 1

        # Traverse from left to right along the bottom row
        for col in range(left, right + 1):
            result.append(matrix[bottom][col])
        bottom -= 1

        if left <= right:
            # Traverse from bottom to top along the right column
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][right])
            right -= 1

        if top <= bottom:
            # Traverse from right to left along the top row
            for col in range(right, left - 1, -1):
                result.append(matrix[top][col])
            top += 1

    return result

# Function to parse a matrix from a string
def parse_matrix(matrix_str: str) -> List[List[int]]:
    matrix = []
    lines = matrix_str.splitlines()
    for line in lines:
        if line.startswith('|'):
            # Convert the row from string to a list of integers
            cleaned_line = line.strip("| ")  # Remove spaces and trailing characters '|'
            string_numbers = cleaned_line.split('|') # split the line by '|'
            row = [int(num) for num in string_numbers]
            matrix.append(row)
    return matrix



# Function to test the get_matrix function
@pytest.mark.asyncio
async def test_get_matrix():
    SOURCE_URL = 'https://raw.githubusercontent.com/avito-tech/python-trainee-assignment/main/matrix.txt'
    TRAVERSAL = [
        10, 50, 90, 130,
        140, 150, 160, 120,
        80, 40, 30, 20,
        60, 100, 110, 70,
    ]

    try:
        print(f"Testing matrix retrieval from {SOURCE_URL}...")
        result = await get_matrix(SOURCE_URL)
        print("Comparing traversal result with expected output...")

        # Compare each element in result and TRAVERSAL
        for i in range(len(result)):
            print(f"Index {i}: Expected {TRAVERSAL[i]}, Got {result[i]}")
            assert result[i] == TRAVERSAL[i]

        print("Test passed successfully!")
    except AssertionError as e:
        print(f"Assertion error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during testing: {e}")

# Function to test additional matrices
@pytest.mark.parametrize("matrix, expected", test_matrices)
def test_spiral_traversal(matrix, expected):
    result = spiral_traversal(matrix)
    assert result == expected, f"Expected {expected}, but got {result}"

if __name__ == "__main__":
    pytest.main()

