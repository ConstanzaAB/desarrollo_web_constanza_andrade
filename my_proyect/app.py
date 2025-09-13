from flask import Flask, request, render_template, redirect, url_for, session
from database import bd
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
