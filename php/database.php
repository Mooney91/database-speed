<?php
// Basic connection settings
// $databaseHost = 'database';

// $databaseUsername = 'user';
// $databasePassword = 'password';
// $databaseName = 'classicmodels';
// $databasePort = 3306;

// Connect to the database
// $mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName, $databasePort); 

function postData($conn)
{
    try {
        $productData = [
            'productLine' => 'Sports Cars',
            'textDescription' => 'Experience the thrill of speed with our collection of high-performance sports cars. These meticulously crafted models showcase cutting-edge design, advanced aerodynamics, and powerful engines. Whether you\'re a racing enthusiast or a fan of sleek aesthetics, our sports cars collection has something for everyone.',
            'htmlDescription' => '<p>Explore our stunning sports cars with sleek designs and powerful engines.</p>',
            'image' => '',
        ];

        // INSERT DATA
        $res = $conn->prepare('INSERT INTO productlines (productLine, textDescription, htmlDescription, image) VALUES (?, ?, ?, ?)');
        $res->bind_param("ssss",$productData['productLine'],
        $productData['textDescription'],
        $productData['htmlDescription'],
        $productData['image']);
        $res->execute();

        print_r($res);
    } catch (\Exception $e) {
        throw $e;
    } finally {
        if ($conn) {
            // $conn->close();
        }
    }
}

function fetchData($conn)
{
    try {
        // FETCH DATA
        $rows = mysqli_query($conn, 'SELECT * FROM productlines');

        print_r($rows);
    } catch (\Exception $e) {
        throw $e;
    } finally {
        if ($conn) {
            // $conn->close();
        }
    }
}

function updateData($conn)
{
    try {
        $updatedTextDescription = 'Updated description for Sports Cars';
        $productLine = 'Sports Cars';

        // UPDATE DATA
        $res = $conn->prepare('UPDATE productlines SET textDescription = ? WHERE productLine = ?');
        $res->bind_param("ss", $updatedTextDescription,
        $productLine);
        $res->execute();

        print_r($res);
    } catch (\Exception $e) {
        throw $e;
    } finally {
        if ($conn) {
            // $conn->close();
        }
    }
}

function deleteData($conn)
{
    try {
        $res = $conn->prepare("DELETE FROM productlines WHERE productLine = 'Sports Cars'");
        // $res->bind_param("i", $id);
        $res->execute();

        print_r($res);
    } catch (\Exception $e) {
        throw $e;
    } finally {
        if ($conn) {
            // $conn->close();
        }
    }
}

function testDatabase($conn, $num)
{
    $databaseHost = 'database';
    $databaseUsername = 'user';
    $databasePassword = 'password';
    $databaseName = 'classicmodels';
    $databasePort = 3306;

    // CONNECT AND MEASURE TIME
    $connectStart = microtime(true);
    $conn = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName, $databasePort);
    $connectEnd = microtime(true);
    $connectTime = $connectEnd - $connectStart;

    $salutation = "
  PHP Tests
  =============

  Connection Time: {$connectTime}
  ";
    file_put_contents('testOutput.txt', $salutation);

    $postTotal = 0;
    $fetchTotal = 0;
    $updateTotal = 0;
    $deleteTotal = 0;
    $test = 0;

    // RUN THE TESTS $num NUMBER OF TIMES
    for ($i = 0; $i < $num; $i++) {
        $startTime = microtime(true);
        postData($conn);
        $endTime = microtime(true);
        $postTime = $endTime - $startTime;

        $startTime = microtime(true);
        fetchData($conn);
        $endTime = microtime(true);
        $fetchTime = $endTime - $startTime;

        $startTime = microtime(true);
        updateData($conn);
        $endTime = microtime(true);
        $updateTime = $endTime - $startTime;

        $startTime = microtime(true);
        deleteData($conn);
        $endTime = microtime(true);
        $deleteTime = $endTime - $startTime;

        $postTotal += $postTime;
        $fetchTotal += $fetchTime;
        $updateTotal += $updateTime;
        $deleteTotal += $deleteTime;
        $test += 1;

        $data = "
    Test {$test}
    ======================================

    Statement   | Time   
    --------------------------------------
    INSERT data | {$postTime}      
    SELECT data | {$fetchTime}      
    ALTER data  | {$updateTime}      
    DELETE data | {$deleteTime}
      ";
        file_put_contents('testOutput.txt', $data, FILE_APPEND);
    }

    $postAverage = $postTotal / $num;
    $fetchAverage = $fetchTotal / $num;
    $updateAverage = $updateTotal / $num;
    $deleteAverage = $deleteTotal / $num;

    $data = "
  Summary
  ============================================

  Statement   | Average Time     
  --------------------------------------------
  INSERT data | {$postAverage}              
  SELECT data | {$fetchAverage}              
  ALTER data  | {$updateAverage}              
  DELETE data | {$deleteAverage}              

  Connection Time: {$connectTime}
  ";
    file_put_contents('testOutput.txt', $data, FILE_APPEND);
}

testDatabase($mysqli, 1000);

?>
