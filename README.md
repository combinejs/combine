```
──────────████──████──█───██─████───███──█──█──███─────────██──███
──────────█──█──█──█──██─███─█──██───█───██─█──█────────────█──█
███──███──█─────█──█──█─█─██─████────█───█─██──███──███─────█──███──███──███
──────────█──█──█──█──█───██─█──██───█───█──█──█─────────█──█────█
──────────████──████──█───██─████───███──█──█──███───────████──███
```

Current version 0.2.1
```bash
> npm i -S @combinejs/core
```

Это повторно используемые конпоненты разметки и стилей основанные на БЭМ подходе,
компилируемые под фронт или бэк, можно компилить одни и теже структуры в динамические вьюхи в идеале под любой стёк.
(от языка нужна только поддержка if и циклов, c angular'ом конечно всё будет посложнее)
В планах сделать под php, ejs, erb, angular, react, nativejs.

А ещё это будет модульный css с наследованием и примесями с возможностью компиляции в любой выходной формат.

### Roadmap:
1.  Упростить формат.
  * Формат по типу json
  * Формат основанный на отступах
  
2.  Попробовать компиляцию ещё под ruby, nodejs, angular, react.
3.  Сделать несколько разных выходных форматов css (БЭМ и ещё парочка)

### На сегодня:
0. Версия 0.2.1 
1. Больше половины компонентов покрыто тестами

### Наглядно:

##### Главный блок ORDERS
Блок `Orders` содержит заголовок `caption` на который примешивается блок `OrdersCaption`, и повторяемый элемент
`order` на который будет примиксован блок `Order`. На сам блок `Orders` примискован блок `TableBeauty`, что делает его таблицей с заголовком c правильной семантикой. 
`TableBeauty` похож на стандартную структуру и будет позже помешен в STD lib.

```
Orders
  rule.mix = 'TableBeauty'

    caption
      rule.mix = 'OrdersCaption'

    order
      rule.each = 'order of orders'
      rule.mix  = 'Order'
```

##### Примесь TABLE_BEAUTY
Примесь таблицы `TableBeauty` задает семантику html и добавляет стили (в выходном формате пока только инлайны),
плавило `match` уточняет как именно накладываються дочерние узлы примеси на узлы целевого блока.
th с жирным шрифтом и фоном станут все дочернии узлы только первого узла tr.

```
TableBeauty
  html.tag    = 'table'
  css.display = 'table'

    row
      rule.match  = '*'
      html.tag    = 'tr'
      css.display = 'table-row'

        cell
          rule.match  = '*'
          html.tag    = 'td'
          css.display = 'table-cell'

    head
      rule.match      = '1'
      css.background  = '#eee'
      css.fontWeight  = '900'

        headCell
          rule.match  = '*'
          html.tag    = 'th'
```

##### Примесь ORDERS_CAPTION
В этом случае примесь является обычный require/include. В будущем будет возможно указывать можно ли совмешать элемент `caption` c блоком `OrdersCaption` на одном узле. (А ещё возможно будет умная обработка css со сложением отступов)

```
OrdersCaption
    id
      rule.output = '"номер"'

    title
      rule.output = '"название"'

    summary
      rule.output = '"сумма"'
```

##### Примесь ORDER
И в окончании всего на элемент `order` накладывается структура `Order`. Структура `Order` отвечает за вывод одного заказа, таким образом реализуется разделение логики компонентов.

```
Order
    id
      rule.output = 'order.id'

    title
      rule.output = 'order.title'

    summary
      rule.output = 'order.summary'
```

### Преобразуем все это в php:
```bash
> node index -php
```

В результате получаем готовую view.php, которая с нетерпением ждет данные из контроллера!
```php
<table class="orders table-beauty" styles="display:table">
  <tr class="orders__caption orders-caption table-beauty__row table-beauty__head" styles="display:table-row;background:#eee;font-weight:900">
    <th class="orders-caption__id table-beauty__cell table-beauty__head-cell" styles="display:table-cell">номер</th>
    <div class="orders-caption__title">название</div>
    <div class="orders-caption__summary">сумма</div>
  </tr>
  <? foreach ($orders as $order) { ?>
    <div class="orders__order order">
      <div class="order__id">
        <?=$order->id;?>
      </div>
      <div class="order__title">
        <?=$order->title;?>
      </div>
      <div class="order__summary">
        <?=$order->summary;?>
      </div>
    </div>
    <?}?>
</table>
```

### Скоро ещё больше фич!
