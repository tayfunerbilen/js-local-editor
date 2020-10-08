# js-local-editor

File System Access API sayesinde tarayıcı üzerinden localde bulunan dosyaları düzenleyebiliyor, silebiliyor ve yeni dosyalar oluşturabiliyoruz.

Ben de bunu baz alarak youtube kanalında örnek bir anlatım yaptım, bu da birkaç düzenlemeden sonraki son hali.

Not: Kullandığım Tree eklentisindeki kodsal sıkıntıdan dolayı (tahminimce) büyük boyutlu klasörlerde kaynağı tükettiği için listeleyemiyor DOM'da. Belki başka bir eklenti ile denenip sorun çözülebilir emin değilim, çözerseniz commit etmekten çekinmeyin :D

### Tarayıcı Desteği

Tarayıcı desteğini [https://caniuse.com/native-filesystem-api](https://caniuse.com/native-filesystem-api) adresinden görebilirsiniz. Şu an için sadece Chrome'un son sürümünde belirli kısıntılar dahilinde kullanılabiliyor. Eğer çalışmıyorsa `chrome://flags/#native-file-system-api` adresine girerek aktif etmeniz gerekebilir.

### DEMO
[https://prototurk.com/demo/js-local-editor/index.html](https://prototurk.com/demo/js-local-editor/index.html)
