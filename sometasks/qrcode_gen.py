import pyqrcode
from pyqrcode import QRCode

s_url='https://www.metropolia.fi/fi'
url = pyqrcode.create(s_url)
url.svg('google_metropolia.svg', scale=8)