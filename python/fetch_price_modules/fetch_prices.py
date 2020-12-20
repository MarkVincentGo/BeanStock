import websocket
import json
import time
import throttle
import os

# @throttle.wrap(1, 15)
def on_message(ws, message):
    print(message)
    text = json.loads(message)
    tick = text['data'][0]['s']
    price = str(text['data'][0]['p'])
    f = open(f'./{tick}-test.json', 'w', encoding='utf-8')
    f.write(price + '\n')

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    ws.send('{"type":"subscribe","symbol":"FB"}')    
    ws.send('{"type":"subscribe","symbol":"AAPL"}')    
    # ws.send('{"type":"subscribe","symbol":"GOOGL"}')    
    # ws.send('{"type":"subscribe","symbol":"NFLX"}')    
    # ws.send('{"type":"subscribe","symbol":"DIS"}')    
    # ws.send('{"type":"subscribe","symbol":"AMZN"}')    
    # ws.send('{"type":"subscribe","symbol":"TSLA"}')    
    # ws.send('{"type":"subscribe","symbol":"CRM"}')    
    # ws.send('{"type":"subscribe","symbol":"INTL"}')    
    # ws.send('{"type":"subscribe","symbol":"EW"}')    

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(f"wss://ws.finnhub.io?token={os.environ.get('FINNHUB_API_KEY', '')}",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()