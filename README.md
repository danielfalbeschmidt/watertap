<h1>Optimal Water Tap</h1>

<a href="https://danielfalbeschmidt.github.io/watertap/" target="_blank">To the application</a>

This application presents a way to save tap water in a cold and hot water mixing system. This project is inspired by the inherent problem with water taps in our everyday life: The water in the hot and cold water mixer and the upper parts of those two's pipelines attatched eventually gets to room temperature. Consequently, when water of a temperature other that the room temperature is needed, some water has to be run (i.e. wasted). In this application minimising the amount of wasted water is carried out programmatically.

The tap water temperature tends to fluctuate at the first seconds of use. This is because of the gradually changing water temperature as the room temperature water at the ends of the cold and hot pipelines flow out and is replaced with the cold and hot water running from those pipes. By the logic used in this application the only temperature change happens when the room temperature water has to be run before reaching the goal temperature. After this, the application keeps the temperature constant even when the pipelines have not yet reached their minimum or maximum temperature.

<b>Terminology and insight:</b>

Input: Temperature input field value<br>
Goal: Goal temperature value, based on the user input<br>
Cold: Coldest water possible<br>
Hot: Hottest water possible<br>
ColdMix: Cold water temperature at the water mixer (ie. tap)<br>
HotMix: Hot water temperature at the water mixer (ie. tap)<br>
Room: Room temperature, the starting value for ColdMix and HotMix<br>
Open: Open water tap (Open button)<br>
Close: Close water tap (Shut button)<br>
ColdCoef: Cold water volume coefficient:<br>
Goal = ColdCoef * ColdMix + (1 - ColdCoef) * HotMix<br>
-> ColdCoef * ColdMix + HotMix - ColdCoef * HotMix - Goal = 0<br>
-> ColdCoef * (ColdMix - Goal) = Goal - HotMix<br>
-> ColdCoef = (Goal - HotMix) / (ColdMix - HotMix)<br>
hotCoef: Hot water volume coefficient: 1 - ColdCoef<br>
PourCold(ColdCoef): Increase the amount of used cold water and decrease ColdMix temperature according to the
ratio parameter ColdCoef<br>
PourHot(HotCoef): Increase the amount of used hot water and decrease ColdMix temperature according to the ratio parameter HotCoef<br>
The mixer water (tap output) temperature corresponds to the cold and hot water volumes and their thermodynamic temperatures.<br>
Let K = 273.15. Then, when the Goal is reached, it holds true that<br>
(ColdMix + K) * ColdCoef + (HotMix + K) * hotCoef - K = Goal<br><br>
Algorithm summary:

        Event: Open ->

        IF (Goal < Cold) THEN {Goal = Cold}
        ELSE IF (Goal > Hot) THEN {Goal = Hot}
        ELSE {Goal = Input}

        WHILE (Goal NOT reached) DO {
          IF (Goal <= Room) THEN {
            PourCold(1)
          }
          ELSE {
            PourHot(1)
          }
        }

        WHILE (NOT Close) DO {
          PourCold(ColdCoef)
          PourHot(HotCoef)
        }
      
Use case examples with different input temperature values:<br>
2: -> Minimum temperature 6 -> only cold water used<br>
74: -> Maximum temperature 60 -> only hot water used<br>
12: -> Colder than room temperature -> pour cold water until its temperature reaches the goal -> mix some hot water to maintain the goal -> change the ratio dynamically between the two -> the ratio remains constant after the cold minimum and the hot maximum temperatures are reached (89/11)<br>
37: -> Hotter than room temperature -> pour hot water until its temperature reaches the goal -> mix some cold water to maintain the goal -> change the ratio dynamically between the two -> the ratio remains constant after the cold minimum and the hot maximum temperatures are reached (43/57)<br>
21: -> Goal = Room temperature -> pour both cold and hot water equally (50/50) -> cold minimum is reached before the hot maximum. More cold water is needed in proportion to hot water as the hot water temperature increases.
