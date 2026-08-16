# Java / Spring 基礎まとめ --- Flask経験者向け

Flaskでの経験と対応させながら、Java / Springで混乱しやすい\
**main / class / interface / abstract / public / private / DTO / DAO /
Service / Controller** を整理する。

------------------------------------------------------------------------

## 1. まずFlaskとSpringを対応させる

Flaskでざっくりこうだったもの：

``` text
app.py
  ↓ アプリ起動
views.py
  ↓ URL受付・処理
DB
```

Springでは役割をより細かく分ける。

``` text
Application.java
    ↓ Spring Boot起動

Controller
    ↓ 受付

Service
    ↓ アプリの処理

DAO / Repository
    ↓ DB操作

Database
```

### 対応表

  Flask                       Spring / Java                    役割
  --------------------------- -------------------------------- -----------------------
  `app.py`                    `Application.java` + `main()`    アプリ起動
  `app.run()`                 `SpringApplication.run()`        Spring Bootを起動
  `views.py`                  `Controller`                     URL・リクエスト受付
  `@route()`                  `@GetMapping` / `@PostMapping`   URLと処理を結びつける
  処理用関数・モジュール      `Service`                        アプリの処理・ルール
  DBアクセス用コード          `DAO / Repository`               DB操作
  dict / データ用クラスなど   `DTO`                            データをまとめて運ぶ

Flaskでは小規模なら `views.py`
に色々書けるが、Springでは役割を分けることが多い。

------------------------------------------------------------------------

# 2. mainとは？

`main` は **Javaプログラムのスタート地点**。

Spring Bootではよくこう書く。

``` java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Flaskでいう：

``` python
if __name__ == "__main__":
    app.run()
```

に近い。

``` text
Java起動
  ↓
main()
  ↓
SpringApplication.run()
  ↓
Spring Boot起動
  ↓
リクエスト待機
```

つまり、

> **main = Flaskのapp.pyにある起動処理**

くらいの理解でOK。

------------------------------------------------------------------------

# 3. classとは？

`class` は **データや処理をまとめた設計図**。

``` java
public class Cat {

    private String name;

    public void cry() {
        System.out.println("にゃー");
    }
}
```

`Cat` という種類のオブジェクトを作れる。

``` java
Cat cat = new Cat();
cat.cry();
```

Springでも、

``` java
public class UserService {
}
```

``` java
public class UserDto {
}
```

など、基本的な部品はclassとして作られる。

------------------------------------------------------------------------

# 4. interfaceとは？

`interface` は、

> **「これを名乗るなら、この機能を用意してください」**

という約束。

``` java
public interface Animal {
    void cry();
}
```

実際の処理はclass側で書く。

``` java
public class Cat implements Animal {

    @Override
    public void cry() {
        System.out.println("にゃー");
    }
}
```

覚え方：

``` text
interface
↓
何をできる必要があるか決める

class
↓
実際にどう動くかを書く

implements
↓
interfaceの約束を実装する
```

------------------------------------------------------------------------

# 5. abstract classとの違い

`interface` と `abstract class` は似て見える。

一番簡単な区別：

``` text
interface
= 「何ができる？」

abstract class
= 「何の仲間？」
```

### interface

``` java
public interface Flyable {
    void fly();
}
```

「飛べる」という能力。

``` java
public class Bird implements Flyable {
}
```

→ Birdは **飛べる**

### abstract class

``` java
public abstract class Animal {

    public void eat() {
        System.out.println("食べる");
    }

    public abstract void cry();
}
```

共通処理を持った「動物」という親。

``` java
public class Cat extends Animal {
}
```

→ Catは **Animalの一種**

覚え方：

``` text
extends
= ○○は△△の一種

implements
= ○○は△△できる
```

学習中はまず `class + interface + implements` を優先して理解すればOK。

------------------------------------------------------------------------

# 6. public / private / protectedとは？

これは、

> **「誰がこの変数・メソッドを使っていいの？」**

を決める。

  修飾子         ざっくり意味
  -------------- -----------------------------------
  `public`       外から使ってOK
  `private`      このclassの中だけ
  `protected`    同じpackageや継承先などから使える
  何も書かない   基本的に同じpackage内

最初は、

``` text
public  = 外向け
private = 内部用
```

を理解すればかなり読める。

------------------------------------------------------------------------

## 7. なぜフィールドはprivate？

DTOでよく見る形：

``` java
public class UserDto {

    private int id;
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
```

意味は：

``` text
private int id
↓
idそのものは外から直接触らせない

public getId()
↓
idを取得する入口は公開

public setId()
↓
idを設定する入口は公開
```

基本形：

``` text
フィールド
→ private

外から使わせるメソッド
→ public

class内部だけで使う補助メソッド
→ private
```

------------------------------------------------------------------------

# 8. メソッドの読み方

ここはかなり重要。

``` java
public UserDto getUser(int id)
```

を4つに分ける。

``` text
public | UserDto    | getUser    | int id
-------|------------|------------|--------
公開   | 戻り値の型 | メソッド名 | 引数
```

日本語にすると、

> **「int型のidを受け取って、UserDtoを返す、外から呼べるgetUserメソッド」**

### voidなら

``` java
public void delete(int id)
```

``` text
public
→ 外から呼べる

void
→ 何も返さない

delete
→ メソッド名

int id
→ int型のidを受け取る
```

### privateなら

``` java
private void checkId(int id)
```

→ **「このclass内部だけで使える、何も返さないcheckIdメソッド」**

------------------------------------------------------------------------

# 9. DTOとは？

DTO = **データを入れて運ぶ箱**

``` java
public class UserDto {

    private int id;
    private String name;

    // getter / setter
}
```

イメージ：

``` text
UserDto
┌───────────────┐
│ id   = 3      │
│ name = Kazuki │
└───────────────┘
```

重要：

> **DTO自身がDBを検索するわけではない。**

DTOは基本的にデータを持つだけ。

------------------------------------------------------------------------

# 10. DAOとは？

DAO = **DB操作担当**

``` java
public interface UserDao {

    UserDto findById(int id);

    void delete(int id);
}
```

この、

``` java
UserDto findById(int id);
```

は、

``` text
int型のidを受け取る
        ↓
DBから検索する
        ↓
UserDtoを返す
```

という約束。

実際のDB処理は実装classに書く。

``` java
public class UserDaoImpl implements UserDao {

    @Override
    public UserDto findById(int id) {

        // DBを検索

        UserDto user = new UserDto();

        user.setId(3);
        user.setName("Kazuki");

        return user;
    }
}
```

流れ：

``` text
DAO
 ↓
DB検索
 ↓
UserDtoを作る
 ↓
setterで検索結果を入れる
 ↓
return user
```

------------------------------------------------------------------------

# 11. Serviceとは？

Service = **アプリとして何をするかを決める場所**

``` java
public class UserService {

    private UserDao userDao;

    public UserDto getUser(int id) {
        return userDao.findById(id);
    }
}
```

この1行：

``` java
return userDao.findById(id);
```

が分かりにくければ、こう分解する。

``` java
public UserDto getUser(int id) {

    UserDto user = userDao.findById(id);

    return user;
}
```

つまり：

``` text
① userDao.findById(id) を呼ぶ

② DAOがDBを検索する

③ DAOからUserDtoが返ってくる

④ ServiceがそのUserDtoを受け取る

⑤ return user でさらに呼び出し元へ返す
```

------------------------------------------------------------------------

# 12. 「DTOの中でDAOを呼んでいる」わけではない

特にここに注意。

``` java
public UserDto getUser(int id) {
    return userDao.findById(id);
}
```

`UserDto` と書いてあるので、

> DTOの中でDAOを呼んでいる？

と見えやすい。

しかし違う。

例えば全体を見る：

``` java
public class UserService {

    private UserDao userDao;

    public UserDto getUser(int id) {
        return userDao.findById(id);
    }
}
```

この処理は、

``` text
public class UserService {
        ↑
ここから

    ...

}
↑
ここまで

全部UserServiceの中
```

`UserDto` は単に、

> **このメソッドはUserDto型を返します**

という意味。

``` text
public UserDto getUser(int id)
       ↑
       戻り値の型
```

### 誰の処理か調べたいとき

**どのclassの `{ }` の中に書かれているかを見る。**

------------------------------------------------------------------------

# 13. `A.B()` の読み方

Javaで、

``` java
userDao.findById(id)
```

が出てきたら、

``` text
userDao . findById(id)
   ↑          ↑
こいつの    この処理を呼ぶ
```

つまり、

> **userDaoのfindById()を呼ぶ**

という意味。

同様に、

``` java
user.getName()
```

なら、

> **userのgetName()を呼ぶ**

という意味。

------------------------------------------------------------------------

# 14. Controllerとは？

Controllerは **リクエストの受付**。

Flaskの `views.py` にかなり近い。

Flask：

``` python
@app.route("/users/<int:id>")
def user(id):
    ...
```

Spring：

``` java
@Controller
public class UserController {

    @GetMapping("/users/{id}")
    public String showUser(@PathVariable int id) {

        UserDto user = userService.getUser(id);

        return "user";
    }
}
```

ControllerはServiceに、

> 「このユーザー取って」

と頼む。

ServiceがDAOに、

> 「DBから探して」

と頼む。

------------------------------------------------------------------------

# 15. 全部つなげる

ブラウザから：

``` text
/users/3
```

にアクセスした場合。

``` text
ブラウザ
    ↓

Controller
「/users/3 が来た」
    ↓
userService.getUser(3)

Service
「ユーザー3を取得する」
    ↓
userDao.findById(3)

DAO
「DBを検索する」
    ↓

Database
id=3
name=Kazuki

    ↓

DAO
new UserDto()
setId(3)
setName("Kazuki")
    ↓
return user

    ↓

Service
UserDtoを受け取る
    ↓
return user

    ↓

Controller
UserDtoを受け取る
    ↓

画面へ
```

------------------------------------------------------------------------

# 16. FlaskとSpringをもう一度比較

### Flaskで一つの関数に書くなら

``` python
@app.route("/users/<int:id>")
def user(id):

    # DB検索
    user = find_user(id)

    # 必要な処理

    return render_template("user.html", user=user)
```

Springではこれを分業させるイメージ。

``` text
Controller
↓
「リクエスト受付」

Service
↓
「何をするか」

DAO
↓
「DBをどう操作するか」

DTO
↓
「データを運ぶ」
```

Springは、

> **Flaskで1か所に書ける処理を、役割ごとにclassへ分けている**

と考えると理解しやすい。

------------------------------------------------------------------------

# 17. 最低限これだけ覚える

``` text
main
= Java / Spring Bootのスタート地点
= Flaskのapp.pyの起動処理に近い


class
= 実際のデータや処理を書く


interface
= 実装してほしい機能を決める


implements
= interfaceの約束を実装する


extends
= 親classを継承する


abstract class
= 共通処理を持てる未完成の親class


Controller
= リクエスト受付
= Flaskのviews.pyに近い


Service
= アプリの処理・ルール


DAO
= DB操作


DTO
= データを運ぶ箱


public
= 外から使ってOK


private
= このclassの中だけ


protected
= 継承先などにも使わせる


void
= 戻り値なし
```

------------------------------------------------------------------------

# 18. コードを読むときの手順

Javaコードを見たら、まずこの順番で見る。

### ① 今どのclassにいる？

``` java
public class UserService {
```

→ 今は `UserService` の中。

### ② メソッドを分解する

``` java
public UserDto getUser(int id)
```

``` text
public
↓
誰から使える？

UserDto
↓
何を返す？

getUser
↓
メソッド名は？

int id
↓
何を受け取る？
```

### ③ `A.B()` を探す

``` java
userDao.findById(id)
```

→ `userDao` の `findById()` を呼んでいる。

### ④ returnを見る

``` java
return user;
```

→ `user` を呼び出し元へ返している。

------------------------------------------------------------------------

## 最終イメージ

``` text
Application.java / main
        │
        │ Spring Boot起動
        ▼

     Controller
   Flaskのviews.py
        │
        │ 呼ぶ
        ▼

      Service
   アプリの処理
        │
        │ 呼ぶ
        ▼

   DAO / Repository
      DB操作
        │
        ▼

     Database


データはDTOに入れて運ぶ
```

まずは、

> **「今どのclassにいるか」→「戻り値は何か」→「誰のメソッドを呼んでいるか」**

の3点を見ると、Java / Springのコードをかなり追いやすくなる。
