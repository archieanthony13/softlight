import socket
import struct

def sendArtnetData(ip, universe, data):
    data = data[:512] + bytes(512 - len(data))

    packet = bytearray()
    packet.extend(b"Art-Net\x00")  # Art-Net header
    packet.extend(struct.pack("<H", 0x5000))  # Opcode
    packet.extend(struct.pack(">H", 14))  # Protocol version
    packet.extend(b"\x00\x00")  # Sequence and physical (not used)
    packet.extend(struct.pack("<H", universe))  # Universe
    packet.extend(struct.pack(">H", len(data)))  # Data length
    packet.extend(data)  # DMX data

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(packet, (ip, 6454))
        print(f"Sent Art-Net data to {ip}:{6454}")

ip = "10.175.60.40"
universe = 1
dmxData = bytes([255] * 512)
sendArtnetData(ip, universe, dmxData)