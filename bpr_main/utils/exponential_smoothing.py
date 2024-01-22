"""
指数平滑帮助类，主要用于蓝牙距离平滑
author：phx
"""


def exponential_smoothing(preview, n):
    l = (5, 2, 9, 15, 22, 29, 37, 48, 60, 78)  # 初始数据
    n = 0.5  # 设置平滑系数
    s0 = (l[0] + l[1] + l[2]) / 3  # 数据量小于20，一般取前三项的均值
    s1 = n * l[0] + (1 - n) * s0
    for i in range(1, 10):
        t = s1
        s = n * l[i] + (1 - n) * t
        t = s
    print(s)
