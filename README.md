# LifeGame2
Life game made by Javascript.

## 世代進行のルール
近傍はムーア近傍をとる。

- 誕生 : 死んでいるセルの近傍に生存しているセルが3つ存在するとき、3つの中で最も多い色の種が誕生する。同数の場合はランダム。

- 生存(捕食) : 生存しているセルの近傍に生存しているセルが2つor3つ存在するとき、その中で最も多い色の種に置き換わる。同数の場合は元の色の種が生存する。

- 過疎死滅 : 生存しているセルの近傍に生存しているセルが1つ以下存在するとき、死滅する。

- 過密死滅 : 生存しているセルの近傍に生存セルが4つ以上存在するとき、死滅する。