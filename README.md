# bemSlim
Проект в активной разработке базовых принципов, это ещё даже не alpha.

Это повторно используемые конпоненты разметки и стилей основанные на БЭМ подходе,
компилируемые под фронт и бэк, в целом с некоторыми ограничениями
возможно компилить одни и теже структуры в динамические вьюхи под любой язык:
php, ejs, erb, angular, react.

А ещё это модульный css с наследованием и примесями с возможностью компиляции в любую методологию.

### Roadmap:
1. Формат шаблонов будет меняться в сторону минимализма, но не во вред читаемости.
2. Возможно будет два формата один строгий, второй похож на coffee или rubySlim.
3. Дописать директиру mixin для смешивания древовидных структур что бы работала в сложных случаях.
4. Написать какие-то базовые вещи что бы можно было попробовать на php, ruby, nodejs, angular, react.
5. После того как всё будет более менее работать отрефакторить и написать тесты на стабильные компоненты.

### На сегодня:
1. Работает самый простой кейс, в котором выводится таблица заказов клиента
2. Можно смешивать древовидные структуры

### Наглядно:

Главый шаблон `Orders` содержит заголовок в тремя элементами и повторяемый элемент
`order` на который будет примиксова структура `Order`. На сам же шаблон `Orders` будет
примешана структура `TableBeauty`, что сделает его таблицей с заголовком c правильной семантикой.
Стоит заметить что `TableBeauty` похож на стандартную структуру и такие штуки будет позже помешены
 в STD namespace проекта. `String` это временный встроенный тип для вывода статичных строк, потом это 
 будет заменено на короткий синтаксис.

```
Orders
  mixin = 'TableBeauty'
 
     caption
         id
             String
               value = 'номер'
 
         title
             String
               value = 'название'
 
         summary
             String
               value = 'сумма'
 
     order
       each  = 'orders > order'
       mixin = 'Order'
```

Примесь таблицы `TableBeauty` задает семантику html и добавляет стили (пока инлайны),
директива `merge` уточняет как именно накладывать примесь на узел, это похоже на css селекоторы позиции
элемента. Можно знаметить что th станут все дочернии узлы первого узла tr. Конечно пока не обошлось без
явного дублирования, но это будет допилено.

```
TableBeauty
  tag = 'table'
  css = 'display:table'

    row
      merge = '*'
      tag   = 'tr'
      css   = 'display:table-row'

        cell
          merge = '*'
          tag   = 'td'
          css   = 'display:table-cell'

    head
      merge = '0'
      tag   = 'tr'
      css   = 'display:table-row;background:#eee;font-weight:900'

        headCell
          merge = '*'
          tag   = 'th'
          css   = 'display:table-cell'
```

И в окончании всего на элемент `order` накладывается структура `Order`, но здесь это больше
похоже на обычный require/include. Структура `Order` отвечает за вывод одного заказа.

```
Order
    id
      var = 'order.id'

    title
      var = 'order.title'

    summary
      var = 'order.summary'
```

### Компилируем в php

```bash
> node index
```

На выходе мы получим такой вот стремненьний код, со странными классами.
Классы сейчас особо не нужны, главное что он хоть какие то выводит.
 
```php
<table class="orders+-table-beauty" styles="display:table">
    <tr class="orders+-table-beauty__caption" styles="display:table-row;background:#eee;font-weight:900">
        <th class="orders+-table-beauty__id" styles="display:table-cell">
            номер        </th>
        <th class="orders+-table-beauty__title" styles="display:table-cell">
            название        </th>
        <th class="orders+-table-beauty__summary" styles="display:table-cell">
            сумма        </th>
    </tr>
    <? foreach ($orders as $order) { ?>
    <tr class="orders+-table-beauty__order+-order" styles="display:table-row">
        <td class="orders+-table-beauty__id" styles="display:table-cell"><?=$order->id;?></td>
        <td class="orders+-table-beauty__title" styles="display:table-cell"><?=$order->title;?></td>
        <td class="orders+-table-beauty__summary" styles="display:table-cell"><?=$order->summary;?></td>
    </tr>
    <? } ?>
</table>
```

### Следите за изменениями, спасибо за внимание!
