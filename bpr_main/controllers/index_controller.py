from flask import Blueprint, render_template, jsonify

index_bp = Blueprint('index_bp', __name__)


@index_bp.before_request
def before_request():
    pass


@index_bp.route('/')
def index_page():
    return render_template('index.html')

