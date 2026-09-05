---
title: "Hello, World! `<prnt>`"
description: "Меняем масштаб элемента."
authors:
  - ivkrylova
contributors:
  - inventoris
related:
  - css/transform-function
  - css/transform
  - css/filter
tags:
  - doka
---

## H2 Section Heading 
### H3 Section Heading  
#### H4 Section Heading 
**Bold text, if h4 was not enough**

**Application architecture** — is a set of decisions regarding how application modules will communicate with each other and with the outside world.

![Logo Icon](../../images/icons/192x192.png)
Tagline to image


<aside>

🍕 It is important to have pizza! With empty lines above and bottom.

</aside>


  <details>
    <summary>More about the details section</summary>

    Here, there can be a long text for those who are interested and have expanded the section.

  </details>


```css
.container {
  display: flex;
}
```

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << 5;       // print the literal number `5`
    std::cout << -6.7;    // print the literal number `-6.7`
    std::cout << 'H';     // print the literal character `H`
    std::cout << "Hello"; // print the literal text `Hello`

    return 0;
}
```

https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md

To make text bold, use two asterisks: **Bold**, and to make text italic , use one underscore: _Italics_ 

Keyboard shortcut: 
<kbd>`Ctrl B`</kbd>

Buttons with double quotes: 
Click the <kbd>`"Save"`</kbd> button

Real symbols instead of unicode: 
<kbd>→</kbd>

Tags in angle brackets: 
<cite>

Parantheses at the end of function name to emphasise difference from properties: 
The method <kbd>`forEach()`</kbd> accepts a callback

1. First
2. Second
3. Тhird
- bullet point;
- bullet point 2;
- bullet point three.

Another set of bullet points (comma):

- Bullet point,
- Bullet point 2,
- Bullet point three. 

References to other documents on site: 

- [Асинхронность в JS](/js/async-in-js/)
- [Как реально работают flex-shrink и flex-grow](/css/flex-grow-shrink/)
- [Как ребейзить ветку и не думать ни о чём](/recipes/git-rebase-onto/)

## Кратко

Свойство `zoom` изменяет масштаб элемента. Если значение меньше 1 или 100%, то элемент уменьшится. А если больше, то элемент увеличится.


## Пример

```html
<p class="small">Уменьшили на 50%<p>
<p class="normal">Оставили обычный размер<p>
<p class="big">Увеличили в 2 раза<p>
```

```css
.small {
  zoom: 50%;
}

.normal {
  zoom: normal;
}

.big {
  zoom: 2;
}
```

## Как пишется

У `zoom` есть четыре значения:

- `normal` — задаёт элементу исходный масштаб. Значение по умолчанию.
- число — коэффициент масштабирования. 1 то же самое, что `normal` или 100%.
- процент — процентное значение. 100% эквивалентно значению `normal`.
- `reset` — не изменяет масштаб элемента, если пользователь масштабирует без жеста «сведения-разведения пальцев». К этому относится, например, комбинация клавиш вроде <kbd>Ctrl +</kbd> или <kbd>Cmd +</kbd>. У этого значения плохая поддержка, перед использованием загляните в [Can I use](https://caniuse.com/mdn-css_properties_zoom_reset).

## Как понять

Используйте `zoom` с осторожностью: это свойство не только масштабирует элемент, но и влияет на расположение соседей, вызывая [перерасчёт макета (_reflow_)](/tools/how-the-browser-creates-pages/#pererisovka-reflow-relayout-i-repaint). Это может ухудшить производительность, особенно в анимациях.

Чтобы увеличить элемент без влияния на соседей, примените [`transform: scale()`](/css/transform-function/#funkcii-masshtabirovaniya) или сразу свойство `scale`. Они не вызывают _reflow_, но могут привести к переполнению, и тогда появится скроллбар.

## Подсказки

💡 Значение свойства не наследуется.

💡 Применимо ко всем элементам.

💡 Свойство можно анимировать.
