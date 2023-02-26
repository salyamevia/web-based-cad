# 2D Web Base CAD

## Cara Menjalankan Program
* Masuk ke folder src
* Jalankan live server pada localhost

## Cara Menggunakan Program
Pada bagian atas canvas, terdapat toolbar untuk memilih jenis objek yang ingin dibangun. Sementara pada bagian kanan canvas, terdapat beberapa pengaturan untuk berinteraksi dan mengatur objek yang sudah ada pada canvas.

Secara umum, pembuatan bentuk apapun dapat dilakukan secara langsung setelah menekan bentuknya pada toolbar. Untuk pembuatan bentuk poligon, sebelumnya harus didefinisikan terlebih dahulu berapa jumlah segi yang akan dibangun. Apabila ingin mengubah jumlah seginya dapat menekan tombol Add Vertex untuk menambah atau Remove Vertex untuk mengurangi. Untuk mengakses mode menggambar lainnya pilih mode terlebih dahulu, lalu pilih bentuk yang akan digunakan.

Ada beberapa mode menggambar yang dapat digunakan, yaitu sebagai berikut.
1. Create, mode default ketika membuka website pertama kali. Mode ini digunakan untuk membuat atau menggambar objek di dalam canvas. Mode ini dapat digunakan dengan memilih 2 titik untuk garis, 1 titik untuk persegi dan persegi panjang, dan n titik untuk poligon.
2. Move, mode ini digunakan untuk mengubah bentuk objek dengan menggerakkan poin-poin pada objek. Mode ini dapat digunakan dengan drag and drop vertex pada garis dan poligon.
3. Horizontal Shear, mode ini digunakan untuk menggeser bentuk objek secara horizontal. Mode ini dapat digunakan dengan drag and drop pada vertex.
4. Vertical Shear, mode ini digunakan untuk menggeser bentuk objek secara vertikal. Mode ini dapat digunakan dengan drag and drop pada vertex.
5. Translation, mode ini digunakan untuk memindahkan objek secara bebas. Mode ini dapat digunakan dengan drag and drop pada titik manapun di dalam objek.
6. Dilatation, mode ini digunakan untuk mengubah ukuran objek menjadi lebih besar atau kecil. Mode ini dapat digunakan dengan drag and drop pada titik manapun di dalam objek.
7. Rotation, mode ini digunakan untuk memutar bentuk objek. Mode ini dapat digunakan dengan drag and drop pada titik manapun di dalam objek.

Untuk mengubah warna, digunakan sistem slider untuk memilih warnanya berdasarkan nilai kombinasi dari kode RGB. Selection button digunakan untuk menentukan apakah ingin mengubah satu atau seluruh poin pada objek. Setelah menentukan pengaturan dari warna, dapat menekan tombol Change Color. Setelah memastikan ada objek yang sudah di seleksi, bisa langsung menekan objek tersebut untuk mengubah warnanya. Jika ingin mengubah warna vertex dapat klik vertex. Jika ingin mengubah warna objek dapat klik bagian manapun di dalam objek.

Apabila ingin menyimpan model (gambar yang dibuat pada canvas) dapat menekan tombol save. Apabila ingin membuka, hanya perlu menekan tombol choose file dan memilih file yang sesuai. Penyimpanan model dilakukan dengan menggunakan file bertipe json. File tersebut memuat informasi berupa daftar objek yang ada pada canvas. Setiap objek dilengkapi dengan tipe objeknya dan koordinat setiap vertex beserta kode warnanya. Berikut adalah contoh kecil isi dari file yang disimpan.