import json
import os
from typing import Dict, Any
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pydantic import BaseModel, Field, field_validator

class BookingRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=5, max_length=20)
    dates: str = Field(..., min_length=1)
    guests: str = Field(default='')
    message: str = Field(default='', max_length=1000)
    
    @field_validator('name', 'phone', 'dates')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Поле не может быть пустым')
        return v.strip()

def send_telegram_message(text: str) -> bool:
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return False
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    req = Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urlopen(req, timeout=10) as response:
            return response.status == 200
    except (URLError, HTTPError):
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Прием заявок на бронирование и отправка в Telegram
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        booking = BookingRequest(**body_data)
        
        message_text = f"""
🏡 <b>Новая заявка на бронирование</b>

👤 <b>Имя:</b> {booking.name}
📞 <b>Телефон:</b> {booking.phone}
📅 <b>Даты:</b> {booking.dates}
👥 <b>Гостей:</b> {booking.guests if booking.guests else 'Не указано'}

{f'💬 <b>Пожелания:</b> {booking.message}' if booking.message else ''}
"""
        
        telegram_sent = send_telegram_message(message_text.strip())
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'telegram_sent': telegram_sent,
                'message': 'Заявка принята'
            }),
            'isBase64Encoded': False
        }
        
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Внутренняя ошибка сервера'}),
            'isBase64Encoded': False
        }
