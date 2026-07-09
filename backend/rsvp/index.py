import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Business: приём и выдача ответов гостей на приглашение (RSVP).
    Args: event с httpMethod (GET — список гостей, POST — новый ответ), body для POST.
          context — объект с request_id.
    Returns: HTTP-ответ со списком гостей или подтверждением сохранения.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = (body.get('name') or '').strip()
        guests = int(body.get('guests') or 1)
        menu_notes = (body.get('menu_notes') or '').strip()

        if not name:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Введите имя'}),
            }

        safe_name = name.replace("'", "''")
        safe_notes = menu_notes.replace("'", "''")
        cur.execute(
            "INSERT INTO rsvp (name, guests, menu_notes) VALUES "
            f"('{safe_name}', {guests}, '{safe_notes}') RETURNING id"
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'id': new_id}),
        }

    cur.execute(
        "SELECT id, name, guests, menu_notes, created_at FROM rsvp ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    guests_list = [
        {
            'id': r[0],
            'name': r[1],
            'guests': r[2],
            'menu_notes': r[3] or '',
            'created_at': r[4].isoformat() if r[4] else '',
        }
        for r in rows
    ]
    total_people = sum(g['guests'] for g in guests_list)

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'guests': guests_list, 'total_people': total_people}),
    }
