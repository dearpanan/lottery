#! -*- coding: utf-8 -*-

import json
import os

from app.libs.utils import DIR_DATA
from app.libs.utils import g_base_logger as mylogger


class LotteryBrand:
    SSC_CHONGQING = 1
    SSC_BEIJING = 2
    ELEVEN_FIVE_GUANGDONG = 20
    type_map = (
        (SSC_CHONGQING, '重庆时时彩'),
        (SSC_BEIJING, '北京时时彩'),
        (ELEVEN_FIVE_GUANGDONG, '广东11选5')
    )

    @classmethod
    def get_name(cls, lottery_brand):
        for brand, name in cls.type_map:
            if brand == lottery_brand:
                return name
        return None


class LotterySsc:
    lotteries_meta = {}
    lotteries = {}

    def __init__(self, brand, name):
        self.brand = brand
        self.brand_name = name
        self.data = {}

    def add_op(self, group, subgroup, op, op_dict):
        if group not in self.data:
            self.data[group] = {}
        if subgroup not in self.data[group]:
            self.data[group][subgroup] = {}
        if op not in self.data[group][subgroup]:
            self.data[group][subgroup][op] = {}
            for op_key in op_dict:
                if op_key != 'brand':
                    self.data[group][subgroup][op][op_key] = op_dict[op_key]

    @classmethod
    def update_ssc(cls, brand, group, subgroup, op, op_dict):
        lottery = None
        if brand not in cls.lotteries:
            brand_name = LotteryBrand.get_name(brand)
            if brand_name:
                lottery = LotterySsc(brand, brand_name)
                cls.lotteries[brand] = lottery
        elif brand in cls.lotteries:
            lottery = cls.lotteries[brand]

        if lottery:
            lottery.add_op(group, subgroup, op, op_dict)

    @classmethod
    def init_lottery_info(cls):
        try:
            f = open(os.path.join(DIR_DATA, 'lottery_ssc.json'),
                     encoding='utf-8')
            data = json.load(f)
            cls.lotteries_meta = data
            if 'name' in data and data['name'] == 'lottery_ssc' and 'group' in data and data['group']:
                for group_key in data['group'].keys():
                    group_data = data['group'][group_key]
                    for subgroup_key in group_data:
                        subgroup_data = group_data[subgroup_key]
                        for op_key in subgroup_data.keys():
                            op_data = subgroup_data[op_key]
                            for brand in op_data['brand']:
                                cls.update_ssc(brand, group_key, subgroup_key,
                                               op_key, op_data)
            else:
                raise Exception('时时彩元数据有问题，name字段不是：lottery_ssc！')
        except Exception as e:
            mylogger.error(e)

    @classmethod
    def save_lottery_info(cls):
        try:
            f = open(os.path.join(DIR_DATA, 'lottery_ssc.json'), mode='w',
                     encoding='utf-8')
            json.dump(cls.lotteries_meta, f)
        except Exception as e:
            mylogger.error(e)


class Lottery5In11:
    lotteries = {}
    lotteries_meta = {}

    def __init__(self, brand, name):
        self.brand = brand
        self.brand_name = name
        self.groups = {}

    def add_op(self, group, subgroup, op, op_dict):
        if group not in self.groups:
            self.groups[group] = {}
        if subgroup not in self.groups[group]:
            self.groups[group][subgroup] = {}
        if op not in self.groups[group][subgroup]:
            self.groups[group][subgroup][op] = {}
            for op_key in op_dict:
                if op_key != 'brand':
                    self.groups[group][subgroup][op][op_key] = op_dict[op_key]

    @classmethod
    def update_ssc(cls, brand, group, subgroup, op, op_dict):
        lottery = None
        if brand not in cls.lotteries:
            brand_name = LotteryBrand.get_name(brand)
            if brand_name:
                lottery = LotterySsc(brand, brand_name)
                cls.lotteries[brand] = lottery
        elif brand in cls.lotteries:
            lottery = cls.lotteries[brand]

        if lottery:
            lottery.add_op(group, subgroup, op, op_dict)

    @classmethod
    def init_lottery_info(cls):
        try:
            f = open(os.path.join(DIR_DATA, 'lottery_11_5.json'),
                     encoding='utf-8')
            data = json.load(f)
            if 'name' in data and data['name'] == 'lottery_11_5' and 'group' in data and data['group']:
                for group_key in data['group'].keys():
                    group_data = data['group']
                    for subgroup_key in group_data[group_key]:
                        subgroup_data = group_data[subgroup_key]
                        for op_key in subgroup_data.keys():
                            op_data = subgroup_data[op_key]
                            for brand in op_data['brand']:
                                cls.update_ssc(brand, group_key, subgroup_key,
                                               op_key, op_data)
            else:
                raise Exception('11选5彩票元数据有问题，name字段不是：lottery_11_5！')
        except Exception as e:
            mylogger.error(e)

    @classmethod
    def save_lottery_info(cls):
        try:
            f = open(os.path.join(DIR_DATA, 'lottery_11_5.json'), mode='w',
                     encoding='utf-8')
            json.dump(cls.lotteries_meta, f)
        except Exception as e:
            mylogger.error(e)

