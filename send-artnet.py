import socket
import struct
import time

# Art-Net constants
ARTNET_PORT = 6454
ARTNET_HEADER = b"Art-Net\x00"
OPCODE_OUTPUT = 0x5000  # Opcode for ArtDMX (data packet)
PROTOCOL_VERSION = 14   # Art-Net protocol version

def send_artnet_data(ip, universe, data):
    # Ensure data length is 512 bytes (DMX standard)
    data = data[:512] + bytes(512 - len(data))

    # Build Art-Net packet
    packet = bytearray()
    packet.extend(ARTNET_HEADER)  # Art-Net header
    packet.extend(struct.pack("<H", OPCODE_OUTPUT))  # Opcode
    packet.extend(struct.pack(">H", PROTOCOL_VERSION))  # Protocol version
    packet.extend(b"\x00\x00")  # Sequence and physical (not used)
    packet.extend(struct.pack("<H", universe))  # Universe
    packet.extend(struct.pack(">H", len(data)))  # Data length
    packet.extend(data)  # DMX data

    # Send packet via UDP
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(packet, (ip, ARTNET_PORT))
        print(f"Sent Art-Net data to {ip}:{ARTNET_PORT}")

# Example usage
if __name__ == "__main__":
    target_ip = "10.175.60.40"  # Replace with your Art-Net device's IP
    universe = 1  # Universe number
    # i = 0
    # while True:
        # if i < 255:
        #     i+=1
        # else:
        #     i=0
        # dmx_data = bytes([0] * 369) + bytes([i]) + bytes([255,0,0]) + bytes([0] * 138)  # Example: All channels at full intensity
        # send_artnet_data(target_ip, universe, dmx_data)
        # time.sleep(0.01)
    # dmx_data = bytes([0] * 512)  # Example: All channels at 0 intensity
    dmx_data = bytes([0] * 369) + bytes([0]) + bytes([255,0,0]) + bytes([0] * 138)
    send_artnet_data(target_ip, universe, dmx_data)
