from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for all routes

DATA_FILE = 'data.json'

def calculate_ema(series, span):
    return series.ewm(span=span, adjust=False).mean()

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/stock/<ticker>', methods=['GET'])
def get_stock_info(ticker):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="2y", interval="1wk") 
    if hist.empty:
        return jsonify({'error': 'No data found for ticker'}), 404

    close_prices = hist['Close']
    ema_10 = calculate_ema(close_prices, 10).iloc[-1]
    ema_20 = calculate_ema(close_prices, 20).iloc[-1]
    ema_40 = calculate_ema(close_prices, 40).iloc[-1]

    info = stock.info
    current_price = info.get("currentPrice") or close_prices.iloc[-1]
    trailing_eps = info.get('trailingEps')
    # pe_ratio = info.get("trailingPE") or current_price / trailing_eps
    pe_ratio = info.get("trailingPE")

    # EMAs list
    # # Calculate start date (need extra weeks for EMA calculation)
    # start_date = datetime.now() - timedelta(weeks=102)
    # # Fetch weekly data directly
    # data = yf.download(ticker, start=start_date, interval='1wk', progress=False)
    
    # # Calculate EMAs on weekly close prices
    # data['EMA_10w'] = data['Close'].ewm(span=10, adjust=False).mean()
    # data['EMA_20w'] = data['Close'].ewm(span=20, adjust=False).mean() 
    # data['EMA_40w'] = data['Close'].ewm(span=40, adjust=False).mean()
    
    # # Get last N weeks and format as API response
    # recent_data = data.tail(52)
    
    # weekly_emas_array = []
    # for date, row in recent_data.iterrows():
    #     if row.empty:
    #         print("Series is empty")
    #     else:
    #         week_data = {
    #             "date": date.strftime('%Y-%m-%d'),
    #             "close": round(float(row['Close']), 2),
    #             "ema_10w": round(float(row['EMA_10w']), 2) if pd.notna(row['EMA_10w']) else None,
    #             "ema_20w": round(float(row['EMA_20w']), 2) if pd.notna(row['EMA_20w']) else None,
    #             "ema_40w": round(float(row['EMA_40w']), 2) if pd.notna(row['EMA_40w']) else None,
    #         }
    #         weekly_emas_array.append(week_data)
    print("__")
    print(hist)
    print("__")
    return jsonify({
        "ticker": ticker.upper(),
        "price": current_price,
        "pe": pe_ratio,
        "ema_10w": round(ema_10, 2),
        "ema_20w": round(ema_20, 2),
        "ema_40w": round(ema_40, 2)
        # "weekly_emas_array": weekly_emas_array
    })

@app.route('/add-stock', methods=['POST'])
def add_stock():
    payload = request.get_json()
    ticker = payload.get('ticker')
    qty = payload.get('qty')
    avg_price = payload.get('avg_price')

    if not ticker or qty is None or avg_price is None:
        return jsonify({'error': 'ticker, qty and avg_price are required'}), 400

    stock = yf.Ticker(ticker)

    hist = stock.history(period="2y", interval="1wk")
    if hist.empty:
        return jsonify({'error': 'No data found for ticker'}), 404

    close_prices = hist['Close']
    ema_10 = calculate_ema(close_prices, 10).iloc[-1]
    ema_20 = calculate_ema(close_prices, 20).iloc[-1]
    ema_40 = calculate_ema(close_prices, 40).iloc[-1]

    info = stock.info
    current_price = info.get("currentPrice")
    pe_ratio = info.get("trailingPE")
    # if current_price is None:
    #     return jsonify({'error': 'Could not fetch current price'}), 400
    # Add back this but do not block user from saving to data.json

    data = load_data()
    data.append({
        'ticker': ticker.upper(),
        'qty': qty,
        'avg_price': avg_price,
        'pe_ratio': pe_ratio,
        'current_price': current_price,
        "ema_10w": round(ema_10, 2),
        "ema_20w": round(ema_20, 2),
        "ema_40w": round(ema_40, 2)
    })
    save_data(data)
    return jsonify({'message': 'Stock added', 'item': data[-1]}), 201

@app.route('/stocks', methods=['GET'])
def list_stocks():
    data = load_data()
    return jsonify(data), 200

@app.route('/update-stock', methods=['PUT'])
def update_stock():
    payload = request.get_json()
    ticker = payload.get('ticker')
    new_qty = payload.get('qty')
    new_avg = payload.get('avg_price')

    if not ticker or new_qty is None or new_avg is None:
        return jsonify({'error': 'ticker, qty and avg_price are required'}), 400

    data = load_data()
    updated = False
    for item in data:
        if item['ticker'] == ticker.upper():
            item['qty'] = new_qty
            item['avg_price'] = new_avg
            updated = True
            break

    if not updated:
        return jsonify({'error': 'Ticker not found'}), 404

    save_data(data)
    return jsonify({'message': 'Stock updated', 'item': item}), 200

@app.route('/refresh-price', methods=['GET'])
def refresh_price():
    data = load_data()

    for item in data:
        stock = yf.Ticker(item['ticker'])
        hist = stock.history(period="2y", interval="1wk")
        if hist.empty:
            return jsonify({'error': 'No data found for ticker'}), 404

        close_prices = hist['Close']
        ema_10 = calculate_ema(close_prices, 10).iloc[-1]
        ema_20 = calculate_ema(close_prices, 20).iloc[-1]
        ema_40 = calculate_ema(close_prices, 40).iloc[-1]

        info = stock.info
        current_price = info.get("currentPrice") or close_prices.iloc[-1]
        pe_ratio = info.get("trailingPE")

        item['current_price'] = current_price

    save_data(data)
    return jsonify({'message': 'Price refreshed', 'item': item}), 200

if __name__ == '__main__':
    if not os.path.exists(DATA_FILE):
        save_data([])
    app.run(debug=True)
