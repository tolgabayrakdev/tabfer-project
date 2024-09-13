from http.server import BaseHTTPRequestHandler, HTTPServer
import requests 
import logging
from urllib.parse import urlparse

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Gelen isteği logla
        logger.info(f"Gelen GET isteği: {self.path}")

        # İsteği hedef sunucuya yönlendir
        response = requests.get(f"http://localhost:8000{self.path}")

        # Hedef sunucunun cevabını geri döndür
        self.send_response(response.status_code)
        self.end_headers()
        self.wfile.write(response.content)

    def do_POST(self):
        # Gelen POST isteğini logla
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        logger.info(f"Gelen POST isteği: {self.path} - Veriler: {post_data}")

        # İsteği hedef sunucuya yönlendir
        headers = {key: value for (key, value) in self.headers.items()}
        response = requests.post(f"http://localhost:8000{self.path}", data=post_data, headers=headers)

        # Hedef sunucunun cevabını geri döndür
        self.send_response(response.status_code)
        self.end_headers()
        self.wfile.write(response.content)

    def do_PUT(self):
        # Gelen PUT isteğini logla
        content_length = int(self.headers['Content-Length'])
        put_data = self.rfile.read(content_length).decode('utf-8')
        logger.info(f"Gelen PUT isteği: {self.path} - Veriler: {put_data}")

        # İsteği hedef sunucuya yönlendir
        headers = {key: value for (key, value) in self.headers.items()}
        response = requests.put(f"http://localhost:8000{self.path}", data=put_data, headers=headers)

        # Hedef sunucunun cevabını geri döndür
        self.send_response(response.status_code)
        self.end_headers()
        self.wfile.write(response.content)

    def do_DELETE(self):
        # Gelen DELETE isteğini logla
        logger.info(f"Gelen DELETE isteği: {self.path}")

        # İsteği hedef sunucuya yönlendir
        response = requests.delete(f"http://localhost:8000{self.path}")

        # Hedef sunucunun cevabını geri döndür
        self.send_response(response.status_code)
        self.end_headers()
        self.wfile.write(response.content)

def run(server_class=HTTPServer, handler_class=ProxyHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Proxy sunucu {port} portunda başlatıldı...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
