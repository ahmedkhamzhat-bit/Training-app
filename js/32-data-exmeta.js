// Dane: grupy i rodzaje ćwiczeń (CSVX_RAW), opisy (LIBX_RAW), klucze nazw.
'use strict';

const CSVX_RAW = `Barbell bench press|chest|comp
Incline Bench Press (Barbell)|chest|comp
Decline Bench Press (Barbell)|chest|comp
Bench Press (Dumbbell)|chest|comp
Incline Bench Press (Dumbbell)|chest|comp
Decline Bench Press (Dumbbell)|chest|comp
Chest Fly (Dumbbell)|chest|iso
Incline Chest Fly (Dumbbell)|chest|iso
Decline Dumbbell Flyes|chest|iso
Cable Crossover|chest|iso
Low Cable Fly|chest|iso
High Cable Crossover|chest|iso
Chest Dip|chest|comp
Chest Dip (Weighted)|chest|comp
Push Up|chest|comp
Incline Push Up|chest|comp
Decline Push Up|chest|comp
Diamond Push Up|chest|comp
Chest Fly (Machine)|chest|iso
Chest Press (Machine)|chest|comp
Incline Chest Press (Machine)|chest|comp
Landmine Chest Press|chest|comp
Dumbbell Pullover|chest|iso
Barbell Floor Press|chest|comp
Dumbbell Floor Press|chest|comp
Squeeze Press (Hex Press)|chest|comp
Single-Arm Cable Chest Press|chest|comp
Plyometric Push-Up|chest|plyo
Clapping Push-Up|chest|plyo
Archer Push Up|chest|comp
Ring Dips|chest|comp
Ring Push-Ups|chest|comp
Svend Press|chest|iso
Guillotine Press|chest|comp
Kettlebell Floor Press|chest|comp
Kettlebell Flyes|chest|iso
Barbell row|back|comp
Pendlay Row|back|comp
Yates Row|back|comp
Single Arm Dumbbell Row|back|comp
Dumbbell Row|back|comp
Chest-Supported Incline Row (Dumbbell)|back|comp
Lat Pulldown (Wide Grip)|back|comp
Close Grip Lat Pulldown|back|comp
Reverse Grip Lat Pulldown|back|comp
Seated Cable Row|back|comp
Straight Arm Pulldown|back|iso
Pull-ups|back|comp
Chin Up|back|comp
Neutral Grip Pull Up|back|comp
Weighted Pull-Up|back|comp
T-Bar Row|back|comp
T-Bar Row (Machine)|back|comp
Deadlift (Barbell)|back|comp
Rack Pull|back|comp
Face Pull|back|iso
Barbell Shrug|back|iso
Dumbbell Shrug|back|iso
Machine Shrug|back|iso
Smith Machine Row|back|comp
Inverted Row|back|comp
Hyperextension|back|iso
Good Morning (Barbell)|back|comp
Meadows Row|back|comp
Kettlebell Gorilla Row|back|comp
Kettlebell Row|back|comp
Muscle Up|back|comp
Single Arm Lat Pulldown|back|comp
Overhead Press (Barbell)|shoulders|comp
Push Press|shoulders|comp
Seated Shoulder Press (Dumbbell)|shoulders|comp
Overhead Press (Dumbbell)|shoulders|comp
Arnold Press (Dumbbell)|shoulders|comp
Standing Lateral Raise (Dumbbell)|shoulders|iso
Cable Lateral Raise|shoulders|iso
Machine Lateral Raise|shoulders|iso
Front Raise (Dumbbell)|shoulders|iso
Barbell Front Raise|shoulders|iso
Front Raise (Cable)|shoulders|iso
Front Raise (Plate)|shoulders|iso
Rear Delt Fly (Dumbbell)|shoulders|iso
Rear Delt Fly (Cable)|shoulders|iso
Reverse Pec Deck|shoulders|iso
Upright Row (Barbell)|shoulders|comp
Upright Row (Dumbbell)|shoulders|comp
Upright Row (Cable)|shoulders|comp
Handstand Push Up|shoulders|comp
Pike Push Up|shoulders|comp
Landmine Press|shoulders|comp
Kettlebell Press|shoulders|comp
Kettlebell Bottoms-Up Press|shoulders|func
Bradford Press|shoulders|comp
Lu Raises|shoulders|iso
Face Pull (Cable)|shoulders|iso
Behind-the-Neck Press|shoulders|comp
Bicep Curl (Barbell)|biceps|iso
Bicep Curl (EZ Bar)|biceps|iso
Bicep Curl (Dumbbell)|biceps|iso
Incline Dumbbell Curl|biceps|iso
Hammer Curl (Dumbbell)|biceps|iso
Cable Hammer Curl (Rope)|biceps|iso
Concentration Curl|biceps|iso
Preacher Curl (Barbell)|biceps|iso
Preacher Curl (Dumbbell)|biceps|iso
Preacher Curl (Machine)|biceps|iso
Spider Curl (Dumbbell)|biceps|iso
Zottman Curl|biceps|iso
Reverse Curl (Barbell)|biceps|iso
Cable Curl (Straight Bar)|biceps|iso
Bayesian Curl|biceps|iso
Overhead Cable Curl|biceps|iso
Drag Curl|biceps|iso
Kettlebell Bicep Curl|biceps|iso
Waiters Curl|biceps|iso
Triceps Pushdown (Rope)|triceps|iso
Triceps Pushdown|triceps|iso
Triceps Pushdown (V-Bar)|triceps|iso
Skullcrusher (Barbell)|triceps|iso
Dumbbell Skullcrusher|triceps|iso
Overhead Triceps Extension (Dumbbell)|triceps|iso
Overhead Triceps Extension (Cable)|triceps|iso
Close Grip Bench Press|triceps|comp
Triceps Dip|triceps|comp
Bench Dips|triceps|comp
Dumbbell Kickback|triceps|iso
Cable Triceps Kickback|triceps|iso
JM Press|triceps|comp
Tate Press|triceps|iso
Single-Arm Cable Tricep Extension|triceps|iso
Machine Triceps Extension|triceps|iso
Machine Tricep Dip|triceps|comp
Wrist Curl (Barbell)|forearms|iso
Reverse Wrist Curl (Barbell)|forearms|iso
Wrist Curl (Dumbbell)|forearms|iso
Reverse Wrist Curl (Dumbbell)|forearms|iso
Farmer's Walk|forearms|func
Barbell Farmer Walk|forearms|func
Kettlebell Farmer Walk|forearms|func
Plate Pinch|forearms|isom
Wrist Roller|forearms|iso
Dead hang|forearms|isom
Towel Hang|forearms|isom
Reverse Grip Cable Curl|forearms|iso
Back squat|legs|comp
Front Squat|legs|comp
Kettlebell Goblet Squat|legs|comp
Leg Press (Machine)|legs|comp
Hack Squat (Machine)|legs|comp
Leg Extension (Machine)|legs|iso
Bulgarian Split Squat (Dumbbell)|legs|comp
Bulgarian Split Squat (Barbell)|legs|comp
Walking Lunge (Dumbbells)|legs|comp
Walking Lunge (Barbell)|legs|comp
Reverse Lunge|legs|comp
Step Up|legs|comp
Sissy Squat|legs|iso
Smith Machine Squat|legs|comp
Zercher Squat|legs|comp
Box Squat|legs|comp
Jump Squat|legs|plyo
Pistol Squat|legs|comp
Cyclist Squat (Heels Elevated)|legs|comp
Pendulum Squat|legs|comp
Belt Squat Machine|legs|comp
Ab Wheel Rollout|core|func
Hanging leg raise|core|iso
Hanging Knee Raise|core|iso
Kneeling Cable Crunch|core|iso
Plank|core|isom
Side Plank|core|isom
Russian Twist|core|iso
Russian Twist (Weighted)|core|iso
Decline Crunch|core|iso
Decline Bench Weighted Crunch|core|iso
Bicycle Crunch|core|iso
Mountain Climbers|core|plyo
V-Up|core|iso
Dragon Flag|core|func
Cable Wood Chop|core|func
Toes to Bar|core|func
L-sit|core|isom
Hollow Body Hold|core|isom
Abdominal Crunch (Machine)|core|iso
Captain's Chair Leg Raise|core|iso
Barbell Hip Thrust|glutes|comp
Dumbbell Hip Thrust|glutes|comp
Hip Thrust (Machine)|glutes|comp
Barbell Glute Bridge|glutes|comp
Cable Pull Through|glutes|comp
Glute Kickback (Cable)|glutes|iso
Glute Kickback (Machine)|glutes|iso
Sumo Deadlift|glutes|comp
Sumo Squat (Barbell)|glutes|comp
Back Extension (Glute Focus)|glutes|comp
Hip Abduction (Machine)|glutes|iso
Curtsy Lunge|glutes|comp
Single-Leg Hip Thrust|glutes|comp
Frog Pump|glutes|iso
Clamshell|glutes|iso
Monster Walk (Lateral Band Walk)|glutes|func
Romanian Deadlift (Barbell)|hamstrings|comp
Romanian Deadlift (Dumbbell)|hamstrings|comp
Stiff Leg Deadlift|hamstrings|comp
Lying Leg Curl|hamstrings|iso
Seated Leg Curl|hamstrings|iso
Standing Leg Curl|hamstrings|iso
Nordic hamstring curl|hamstrings|func
Glute Ham Raise|hamstrings|comp
Single Leg Romanian Deadlift|hamstrings|comp
Kettlebell Romanian Deadlift|hamstrings|comp
Swiss Ball Leg Curl|hamstrings|iso
Standing Calf Raise (Machine)|calves|iso
Seated Calf Raise (Machine)|calves|iso
Barbell Calf Raise|calves|iso
Standing Dumbbell Calf Raise|calves|iso
Donkey Calf Raise|calves|iso
Leg Press Calf Raise|calves|iso
Single Leg Calf Raise|calves|iso
Tibialis Raise|calves|iso
Barbell Tibialis Raise|calves|iso
Smith Machine Calf Raise|calves|iso
Snatch|other|oly
Clean and Jerk|other|oly
Power Clean|other|oly
Hang Clean|other|oly
Kettlebell Swing|other|func
Double Kettlebell Clean|other|func
Turkish Get Up|other|func
Burpee|other|func
Box Jump|other|plyo
Broad Jump|other|plyo
Battle Ropes Slam|other|func
Sled Push|other|func
Sled Pull|other|func
Tire Flip|other|func
Wall Ball|other|func
Thruster (Barbell)|other|comp
Dumbbell Thruster|other|comp
Kettlebell Thruster|other|comp
Bear Crawl|other|func`;
let _cx = null;
function csvx(n) {
  if (!_cx) {
    _cx = {};
    CSVX_RAW.split("\n").forEach((ln, i) => {
      const f = ln.split("|");
      if (f.length < 3) return;
      const k = ckey(f[0]);
      if (!_cx[k]) _cx[k] = { i, g: f[1], ty: f[2] };
    });
  }
  return _cx[ckey(n)] || null;
}
let _lk = null;
function ckey(name) {
  if (!_lk) {
    _lk = {};
    EXLIB.forEach((x) => {
      const k2 = norm(x[0]);
      _lk[k2] = k2;
      _lk[norm(x[1])] = k2;
    });
  }
  const k = norm(name);
  return _lk[k] || k;
}
function libDisp(n) {
  const k = ckey(n), x = EXLIB.find((q) => norm(q[0]) === k);
  return x ? x[1] : n;
}
function exLibNames() {
  const seen = {}, out = [];
  const add = (n) => {
    const k = ckey(n);
    if (k && !seen[k]) {
      seen[k] = 1;
      out.push(libDisp(String(n).trim()));
    }
  };
  EXLIB.forEach((x) => add(x[0]));
  (meta.customEx || []).forEach(add);
  const used = {};
  trSess().forEach((x) => x.exercises.forEach((e) => {
    used[ckey(e.name)] = 1;
  }));
  return out.sort((a, b) => (used[ckey(b)] ? 1 : 0) - (used[ckey(a)] ? 1 : 0) || a.localeCompare(b, lang));
}
const LIBX_RAW = `bb,bn|chest|front_delts,triceps|Połóż się na ławce, łopatki ściągnięte, stopy na podłodze. Opuść sztangę kontrolowanie do dolnej części klatki i wypchnij w górę.|Lie on the bench, shoulder blades pulled together, feet on the floor. Lower the bar under control to the lower chest and press it up.
bb|hamstrings,glutes,back|legs,traps,grip,core|Sztanga nad środkiem stopy, plecy proste. Napnij brzuch, odepchnij się nogami i wyprostuj biodra, sztangę prowadź blisko ciała.|Bar over mid-foot, back flat. Brace, push through the legs and extend the hips, keeping the bar close to the body.
bb|legs,glutes|hamstrings,core|Sztanga na karku, stopy na szerokość barków. Zejdź do co najmniej równoległości ud i wstań, napinając brzuch.|Bar on the upper back, feet shoulder-width. Descend to at least parallel and stand, bracing the abs.
bb|front_delts|triceps,lateral_delts,core|Stojąc, sztanga na obojczykach. Napnij pośladki i brzuch, wypchnij sztangę nad głowę.|Standing, bar on the collarbones. Squeeze glutes and abs and press the bar overhead.
bar,bw|back|biceps,upper_back,grip|Chwyt nachwytem nieco szerszy niż barki. Podciągnij się, aż broda minie drążek, opuść się do pełnego zwisu.|Overhand grip a little wider than the shoulders. Pull until the chin clears the bar, lower to a full hang.
bw|chest|triceps,front_delts,core|Dłonie pod barkami, ciało w jednej linii. Opuść klatkę nisko i wypchnij do pełnego wyprostu.|Hands under the shoulders, body in one line. Lower the chest and press up to full extension.
bw|chest,triceps|front_delts|Na poręczach, lekko pochylony do przodu. Opuść się do ok. 90° w łokciach i wypchnij w górę.|On parallel bars, leaning slightly forward. Lower to about 90° at the elbows and press up.
bar,bw|core|grip|W zwisie. Unieś proste nogi do wysokości bioder lub wyżej, bez bujania.|Hanging from a bar. Raise straight legs to hip height or higher without swinging.
bw|core|triceps|Podpór na poręczach lub podłodze z nogami uniesionymi przed sobą. Utrzymaj pozycję.|Support on parallel bars or the floor with legs held out in front. Hold the position.
bw|core|front_delts|Podpór na przedramionach, ciało w linii. Napnij brzuch i pośladki, nie wypychaj bioder w górę.|Forearm support, body in a line. Brace abs and glutes, do not push the hips up.
db|biceps|forearms|Hantle przy bokach, łokcie nieruchome. Uginaj ramiona, obracając dłonie do góry.|Dumbbells at the sides, elbows still. Curl while rotating the palms upward.
bb|back,upper_back|biceps,rear_delts,grip|Tułów pochylony, plecy proste. Przyciągnij sztangę do dolnej części brzucha, ściągając łopatki.|Hinge forward with a flat back. Pull the bar to the lower abdomen, squeezing the shoulder blades.
bw|hamstrings|glutes|Klęcząc ze zablokowanymi stopami, opuszczaj tułów powoli do przodu, hamując ruch tylnymi ścięgnami.|Kneeling with feet anchored, lower the torso slowly forward, resisting with the hamstrings.
bw|front_delts|triceps,upper_back,traps|Stań na rękach przodem do ściany, ciało w linii. Opuść głowę do podłogi, zginając łokcie, i wypchnij do pełnego wyprostu.|Kick up to a handstand facing the wall, body in line. Lower the head toward the floor by bending the elbows, then press back to full extension.
bar|grip,forearms|back,core|Chwyć drążek nachwytem i zwisaj z wyprostowanymi ramionami, barki aktywne. Utrzymaj pozycję jak najdłużej.|Grab the bar overhand and hang with straight arms and active shoulders. Hold as long as you can.`;
let _lx = null;
function libInfo(name) {
  if (!_lx) {
    _lx = {};
    LIBX_RAW.split("\n").forEach((ln, i) => {
      const f = ln.split("|"), x2 = EXLIB[i];
      if (!x2 || f.length < 5) return;
      _lx[norm(x2[0])] = { eq: f[0].split(","), p: f[1].split(",").filter(Boolean), s: f[2].split(",").filter(Boolean), pl: f[3], en: f[4] };
    });
  }
  const x = _lx[ckey(name)];
  if (x) return x;
  const y2 = LIB2[ckey(name)];
  if (y2) return { eq: y2.eq, p: y2.p, s: y2.s, pl: "", en: "" };
  const c = meta.exInfo && meta.exInfo[ckey(name)];
  return c ? { eq: c.eq || [], p: c.p || [], s: c.s || [], pl: "", en: "", cu: true } : null;
}
