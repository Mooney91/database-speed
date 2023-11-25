const fs = require('fs');
const {performance} = require('perf_hooks');
const mariadb = require('mariadb')
const pool = mariadb.createPool({
  host: 'database',
  port: '3306',
  user: 'user',
  password: 'password',
  database: 'classicmodels'
})

async function postData (conn) {
  // let conn
  try {
    // conn = await pool.getConnection()

    const productData = {
      productLine: 'Sports Cars',
      textDescription: 'Experience the thrill of speed with our collection of high-performance sports cars. These meticulously crafted models showcase cutting-edge design, advanced aerodynamics, and powerful engines. Whether you\'re a racing enthusiast or a fan of sleek aesthetics, our sports cars collection has something for everyone.',
      htmlDescription: '<p>Explore our stunning sports cars with sleek designs and powerful engines.</p>',
      image: ''
    }

    const res = await conn.query('INSERT INTO productlines (productLine, textDescription, htmlDescription, image) VALUES (?, ?, ?, ?)', [productData.productLine, productData.textDescription, productData.htmlDescription, productData.image])

    console.log(res) // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}

async function fetchData (conn) {
  // let conn
  try {
    // conn = await pool.getConnection()

    const rows = await conn.query('SELECT * FROM productlines')

    console.log(rows)
  } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}

async function updateData (conn) {
  // let conn
  try {
    // conn = await pool.getConnection()

    const updatedTextDescription = 'Updated description for Sports Cars'

    const res = await conn.query('UPDATE productlines SET textDescription = ? WHERE productLine = ?', [updatedTextDescription, 'Sports Cars'])

    console.log(res) 
    } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}

async function deleteData (conn) {

  try {

    const res = await conn.query("DELETE FROM productlines WHERE productLine = 'Sports Cars'")

    console.log(res) 
    } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}

async function testDatabase(num) {
  // let connectStart = new Date();
  // let connectStart = (new Date()).getTime() / 1000;
  let connectStart = performance.now()
  const conn = await pool.getConnection()
  // let connectEnd = new Date();
  // let connectEnd = (new Date()).getTime() / 1000;
  let connectEnd = performance.now();
  let connectTime = connectEnd - connectStart

  let salutation = `
  Node.js Tests
  =============

  Connection Time: ${connectTime / 1000}
  `
  fs.writeFile('testOutput.txt', salutation, (err) => {
    if (err) throw err;
  });

  let postTotal = 0;
  let fetchTotal = 0;
  let updateTotal = 0;
  let deleteTotal = 0;
  let test = 0;

  for (let i = 0; i < num; i++) {
    // let startTime = new Date()
    // let startTime = (new Date()).getTime() / 1000;
    let startTime = performance.now();
    await postData(conn)
    // let endTime = (new Date()).getTime() / 1000;
    let endTime = performance.now();
    // let endTime = new Date()
    let postTime = endTime - startTime

    // Testing fetchData
    // startTime = new Date()
    // startTime = (new Date()).getTime() / 1000;
    startTime = performance.now();
    await fetchData(conn)
    // endTime = new Date()
    // endTime = (new Date()).getTime() / 1000;
    endTime = performance.now();
    let fetchTime = endTime - startTime

    // Testing updateData
    // startTime = new Date()
    // startTime = (new Date()).getTime() / 1000;
    startTime = performance.now();
    await updateData(conn)
    // endTime = new Date()
    // endTime = (new Date()).getTime() / 1000;
    endTime = performance.now();
    let updateTime = endTime - startTime

    startTime = performance.now();
    await deleteData(conn)
    endTime = performance.now();
    let deleteTime = endTime - startTime

    postTotal += postTime;
    fetchTotal += fetchTime;
    updateTotal += updateTime;
    deleteTotal += deleteTime;
    test += 1;

    let data = `
    Test ${test}
    ==================================

    Statement   | Time   
    ----------------------------------
    INSERT data | ${postTime / 1000}      
    SELECT data | ${fetchTime / 1000}      
    ALTER data  | ${updateTime / 1000}      
    DELETE data | ${deleteTime / 1000}      
      `
    fs.appendFile('testOutput.txt', data, (err) => {
      if(err) throw err;
    })
  }

  let postAverage = postTotal/num;
  let fetchAverage = fetchTotal/num;
  let updateAverage = updateTotal/num;
  let deleteAverage = deleteTotal/num;

  let data = `
  Summary
  ===========================================

  Statement   | Average Time     
  --------------------------------
  INSERT data | ${postAverage / 1000}              
  SELECT data | ${fetchAverage / 1000}              
  ALTER data  | ${updateAverage / 1000}              
  DELETE data | ${deleteAverage / 1000}              

  Connection Time: ${connectTime / 1000}
  `
  fs.appendFile('testOutput.txt', data, (err) => {
    if(err) throw err;
  })
}

testDatabase(1000)
