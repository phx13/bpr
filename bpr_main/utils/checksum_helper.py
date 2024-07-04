"""
校验和帮助类，主要用于北斗指令异或校验
author：phx
"""


# ascii字符串转16进制数组方法
# 如'CCRMO,BSI,2,0'
# 转为['43', '43', '52', '4d', '4f', '2c', '42', '53', '49', '2c', '32', '2c', '30']
def ascii2hex(ascii_str):
    ascii_list = []
    for char in ascii_str:
        ascii_list.append(ord(char))
    hex_list = []
    for code in ascii_list:
        hex_list.append(hex(code))
    print(hex_list)
    hex_str = ''.join(hex_list)
    return hex_str

    # # 字符串转为16进制
    # hex_data = ascii_str.encode().hex()
    # # 初始化16进制数组
    # hex_array = []
    # # 按位计算16进制数，加入到数组
    # for i in range(0, int(len(hex_data)), 2):
    #     hex_array.append(hex_data[i:i + 2])
    # return hex_array


# 字符串转16进制方法
def str2hex(s):
    return int(s, base=16)


# 异或校验计算方法
def bcc_checksum(hex_array):
    # 初始化bcc
    bcc = 0
    # 遍历异或运算
    for s in hex_array.split('0x')[1:]:
        bcc ^= str2hex(s)
    # 得到16进制的bcc
    return str(hex(bcc))[-2:].upper()
