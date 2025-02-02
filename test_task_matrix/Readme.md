# Test Assignment for Python
## Requirements

You need to implement a Python library that retrieves a square matrix (NxN) from a remote server and returns it to the user as a List[int]. This list should contain the result of traversing the retrieved matrix in a spiral order: counterclockwise, starting from the top-left corner (see the test case below).

Example of the source matrix:

```
+-----+-----+-----+-----+
|  10 |  20 |  30 |  40 |
+-----+-----+-----+-----+
|  50 |  60 |  70 |  80 |
+-----+-----+-----+-----+
|  90 | 100 | 110 | 120 |
+-----+-----+-----+-----+
| 130 | 140 | 150 | 160 |
+-----+-----+-----+-----+
```
The matrix is guaranteed to contain non-negative integers. No other formatting symbols are expected.

## Requirements for Implementation and Documentation
The library should contain a function with the following interface:

```
python

async def get_matrix(url: str) -> List[int]:
    ...
```

- The function receives a URL to download the matrix from the server via HTTP(S).

- The function returns a list containing the result of traversing the retrieved matrix in a spiral order: counterclockwise, starting from the top-left corner.

- Interaction with the server should be implemented asynchronously using aiohttp, httpx, or another asyncio-based component.

- The library should handle server and network errors correctly (5xx, Connection Timeout, Connection Refused, etc.).

- The size of the matrix may be changed in the future while maintaining the same formatting. The library should remain functional with square matrices of different sizes.

- The solution should be placed on one of the public git-hosting platforms (GitHub, GitLab, Bitbucket). You can also send the solution as an archive (zip, tar). Uploading the library to PyPi or other repositories is not required.

##  Solution Verification


For self-checking, you can use the following test case:

python
```
SOURCE_URL = 'https://raw.githubusercontent.com/avito-tech/python-trainee-assignment/main/matrix.txt'
TRAVERSAL = [
    10, 50, 90, 130,
    140, 150, 160, 120,
    80, 40, 30, 20,
    60, 100, 110, 70,
]

def test_get_matrix():
    assert asyncio.run(get_matrix(SOURCE_URL)) == TRAVERSAL
```

When verifying, we will also pay attention to tests, type hints, solution structure, and overall code quality.

Good luck with the task, and don't forget about The Zen of Python! :)