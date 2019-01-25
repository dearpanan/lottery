# -*- coding: utf-8 -*-

from . import web
from flask import render_template
from flask_login import login_required
from app.models.lotteries import LotterySsc, LotteryBrand


@web.route('/lottery/ssc/chongqing')
@login_required
def lottery_ssc_chongqing():
    brand = LotteryBrand.SSC_CHONGQING
    if brand in LotterySsc.lotteries:
        lottery = LotterySsc.lotteries[brand]
    else:
        return None

    return render_template('lottery_main.html',
                           lottery_name=lottery.brand_name,
                           lottery=lottery.data)

