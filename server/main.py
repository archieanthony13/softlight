import socket
import struct
import asyncio
import websockets
import json

def sendArtnetData(ip, universe, data):
    # Contruct an array of length 512 which is standard for the DMX protocol
    data = data[:512] + bytes(512 - len(data))

    # Contruct the Art-Net packet
    packet = bytearray()
    packet.extend(b"Art-Net\x00")  # Art-Net header
    packet.extend(struct.pack("<H", 0x5000))  # Opcode
    packet.extend(struct.pack(">H", 14))  # Protocol version
    packet.extend(b"\x00\x00")  # Sequence and physical (not used)
    packet.extend(struct.pack("<H", universe))  # Universe
    packet.extend(struct.pack(">H", len(data)))  # Data length
    packet.extend(data)  # DMX data

    # Send the Art-Net packet to the Art-Net node using the given IP
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(packet, (ip, 6454))

async def echo(websocket):
    # Handle WebSocket communication
    async for message in websocket:
        # Split incoming message into sections
        messageSplit = json.loads(message)
        ip = messageSplit[0]
        universe = messageSplit[1]
        data = bytes(json.loads(messageSplit[2]))
        # Send DMX data across Art-Net for each universe
        for i in range(int(len(data)/512)):
            sendArtnetData(ip, i + 1, data[i*512:(i+1)*512-1])

async def main():
    # Create the WebSocket connection to allow JavaScript to talk to Art-Net
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()

# Run the WebSocket
asyncio.run(main())