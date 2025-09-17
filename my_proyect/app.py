from flask import Flask, request, render_template, redirect, url_for, session
#from database import bd
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('main/index.html')

@app.route('/form_add')
def form_add():
    return render_template('form/form_add.html')

@app.route('/see_post')
def see_post():
    return render_template('posts/see_post.html')

@app.route('/statistics')
def statistics():
    return render_template('statistics/statistics.html')

if __name__ == '__main__':
    app.run(debug=True)

