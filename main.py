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

import asyncio
import websockets

import threading
import json

async def echo(websocket):
    async for message in websocket:
        messageSplit = json.loads(message)
        ip = messageSplit[0]
        universe = messageSplit[1]
        data = bytes(json.loads(messageSplit[2]))
        sendArtnetData(ip, universe, data)

async def main():
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()  # Run forever

asyncio.run(main())