import mariadb
import time
import sys

# CREATE A CONNECTION WITH THE DATABASE
# try:
#     conn = mariadb.connect(
#         host="database",
#         port=3306,
#         user="user",
#         password="password",
#         database="classicmodels"
#     )
# except mariadb.Error as e:
#     print(f"Error connecting to the database: {e}")
#     sys.exit(1)

def post_data(conn):
    try:
        cur = conn.cursor()

        product_data = {
            'productLine': 'Sports Cars',
            'textDescription': 'Experience the thrill of speed with our collection of high-performance sports cars. These meticulously crafted models showcase cutting-edge design, advanced aerodynamics, and powerful engines. Whether you\'re a racing enthusiast or a fan of sleek aesthetics, our sports cars collection has something for everyone.',
            'htmlDescription': '<p>Explore our stunning sports cars with sleek designs and powerful engines.</p>',
            'image': ''
        }

        cur.execute(
            'INSERT INTO productlines (productLine, textDescription, htmlDescription, image) VALUES (?, ?, ?, ?)',
            (product_data['productLine'], product_data['textDescription'], product_data['htmlDescription'], product_data['image'])
        )

        conn.commit()
    except mariadb.Error as e:
        print(f"Error inserting data: {e}")
        raise
    finally:
        cur.close()

def fetch_data(conn):
    try:
        cur = conn.cursor()

        cur.execute('SELECT * FROM productlines')

        rows = cur.fetchall()
        print(rows)
    except mariadb.Error as e:
        print(f"Error fetching data: {e}")
        raise
    finally:
        cur.close()

def update_data(conn):
    try:
        cur = conn.cursor()

        updated_text_description = 'Updated description for Sports Cars'

        cur.execute('UPDATE productlines SET textDescription = ? WHERE productLine = ?', (updated_text_description, 'Sports Cars'))

        conn.commit()
    except mariadb.Error as e:
        print(f"Error updating data: {e}")
        raise
    finally:
        cur.close()

def delete_data(conn):
    try:
        cur = conn.cursor()

        # updated_text_description = 'Updated description for Sports Cars
        # productLineID = 'Sports Cars'

        cur.execute("DELETE FROM productlines WHERE productLine = 'Sports Cars'")

        conn.commit()
    except mariadb.Error as e:
        print(f"Error deleting data: {e}")
        raise
    finally:
        cur.close()

def test_database(num):
    post_total = 0
    fetch_total = 0
    update_total = 0
    delete_total = 0

    test = 0

    start_time = time.time()
    try:
        conn = mariadb.connect(
            host="database",
            port=3306,
            user="user",
            password="password",
            database="classicmodels"
        )
    except mariadb.Error as e:
        print(f"Error connecting to the database: {e}")
        sys.exit(1)
    end_time = time.time()
    connect_time = end_time - start_time

    salutation = f"""
    Python Tests
    =============

    Connection Time: {connect_time}
    """

    with open('testOutput.txt', 'w') as file:
            file.write(salutation)

    for i in range(num):
        start_time = time.time()
        post_data(conn)
        end_time = time.time()
        post_time = end_time - start_time

        start_time = time.time()
        fetch_data(conn)
        end_time = time.time()
        fetch_time = end_time - start_time

        start_time = time.time()
        update_data(conn)
        end_time = time.time()
        update_time = end_time - start_time

        start_time = time.time()
        delete_data(conn)
        end_time = time.time()
        delete_time = end_time - start_time

        post_total += post_time
        fetch_total += fetch_time
        update_total += update_time
        delete_total += delete_time
        test += 1

        data = f"""
        Test {test}
        =================================

        Statement   | Time   
        ---------------------------------
        INSERT data | {post_time}      
        SELECT data | {fetch_time}      
        ALTER data  | {update_time}      
        DELETE data | {delete_time}      
        """

        with open('testOutput.txt', 'a') as file:
            file.write(data)

    post_average = post_total / num
    fetch_average = fetch_total / num
    update_average = update_total / num
    delete_average = delete_total / num

    summary = f"""
    Summary
    ===========================================

    Statement   | Average Time     
    -------------------------------------------
    INSERT data | {post_average}              
    SELECT data | {fetch_average}              
    ALTER data  | {update_average}             
    DELETE data | {delete_average}             

    Connection Time: {connect_time}
    """

    with open('testOutput.txt', 'a') as file:
        file.write(summary)

# try:
test_database(1000)
# finally:
#     # conn.close()