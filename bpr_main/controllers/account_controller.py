from flask import Blueprint, render_template
from flask_login import login_required

account_bp = Blueprint('account_bp', __name__)


@account_bp.before_request
@login_required
def before_request():
    pass


@account_bp.route('/account')
def account_page():
    return render_template('account.html')
