// Dane: lista ćwiczeń (EXLIB) i baza rozszerzona (LIB2_RAW).
'use strict';

const EXLIB = [
  ["Wyciskanie sztangi leżąc", "Barbell bench press"],
  ["Martwy ciąg", "Deadlift"],
  ["Przysiad ze sztangą", "Back squat"],
  ["Wyciskanie nad głowę", "Overhead press"],
  ["Podciąganie", "Pull-ups"],
  ["Pompki", "Push-ups"],
  ["Pompki na poręczach (dipy)", "Dips"],
  ["Unoszenie nóg w zwisie", "Hanging leg raise"],
  ["L-sit", "L-sit"],
  ["Plank", "Plank"],
  ["Uginanie ramion z hantlami", "Dumbbell curl"],
  ["Wiosłowanie sztangą", "Barbell row"],
  ["Nordic curl", "Nordic hamstring curl"],
  ["Pompki w staniu na rękach", "Handstand push-ups"],
  ["Zwis na drążku", "Dead hang"]
];
const LIB2_RAW = `Abdominal Air Bike|bw|core||bwr
Abdominal Crunch (Machine)|mc|core||wr
Ab Scissors|bw|core||bwr
Ab Wheel Rollout|bw|core||bwr
Alternating Dumbbell Curl|db|biceps||wr
Anti-Rotation Pallof Press|cb|core||wr
Arnold Press (Dumbbell)|db|shoulders||wr
Archer Push Up|bw|chest||bwr
Assisted Dip|mc|triceps||wr
Assisted Pull Up|mc|back||wr
Back Extension|ot|lower_back||wr
Back Extension (Glute Focus)|ot|glutes||wr
Back Extension (Machine)|mc|lower_back||wr
Back Extension (Weighted)|bw|lower_back||wbw
Back Lever|bar,bw|back||dur
Band Assisted Dip|band|triceps||bwr
Band Assisted Pull Up|band|back||bwr
Band Bicep Curl|band|biceps||bwr
Band Chest Fly|band|chest||bwr
Band Chest Press|band|chest||bwr
Band External Rotation|band|rotator_cuff||bwr
Band Face Pull|band|rear_delts||bwr
Band Front Raise|band|front_delts||bwr
Band Good Morning|band|hamstrings||bwr
Band Glute Kickback|band|glutes||bwr
Band Hammer Curl|band|biceps||bwr
Band Internal Rotation|band|rotator_cuff||bwr
Band Lateral Raise|band|lateral_delts||bwr
Band Leg Curl|band|hamstrings||bwr
Band Leg Extension|band|legs||bwr
Band Pallof Press|band|core||bwr
Band Pull Apart|band|rear_delts||bwr
Band Pull Down|band|back||bwr
Band Pull Through|band|glutes||bwr
Band Row|band|back||bwr
Band Shoulder Press|band|shoulders||bwr
Band Squat|band|legs||bwr
Band Triceps Pushdown|band|triceps||bwr
Band Overhead Triceps Extension|band|triceps||bwr
Barbell Complex|bb|full_body||wr
Barbell Curl|bb|biceps||wr
Barbell Glute Bridge|bb|glutes||wr
Barbell Hip Thrust|bb|glutes||wr
Barbell Lunge|bb|legs||wr
Barbell Shrug|bb|traps||wr
Barbell Split Squat|bb|legs||wr
Barbell Calf Raise|bb|calves||wr
Battle Ropes|ot|full_body||dur
Bayesian Curl|bb|biceps||wr
Bear Crawl|bw|full_body||dur
Bear Complex|bb|full_body||wr
Behind the Back Bicep Wrist Curl|bb|forearms||wr
Behind the Back Shrug|bb|traps||wr
Bench Press (Barbell)|bb|chest||wr
Bench Press (Dumbbell)|db|chest||wr
Bench Press - Close Grip (Barbell)|bb|triceps||wr
Bicycle Crunch|bw|core||bwr
Bird Dog|bw|core||bwr
Bicep Curl (Barbell)|bb|biceps||wr
Bicep Curl (Dumbbell)|db|biceps||wr
Bicep Curl (EZ Bar)|bb|biceps||wr
Block Pull|bb|back||wr
Board Press|bb|chest||wr
Bodyweight Lunge|bw|legs||bwr
Bodyweight Squat|bw|legs||bwr
Bodyweight Triceps Extension|bw|triceps||bwr
Bulgarian Split Squat|bw|legs||bwr
Burpee|bw|full_body||bwr
Burpee Pull Up|bar,bw|full_body||bwr
Cable Bicep Curl|cb|biceps||wr
Cable Chest Fly|cb|chest||wr
Cable Chest Press|cb|chest||wr
Cable Crossover|cb|chest||wr
Cable Curl|cb|biceps||wr
Cable Curl (EZ Bar)|cb|biceps||wr
Cable Curl (Rope)|cb|biceps||wr
Cable Curl (Straight Bar)|cb|biceps||wr
Cable External Rotation|cb|rotator_cuff||wr
Cable Internal Rotation|cb|rotator_cuff||wr
Cable Lateral Raise|cb|lateral_delts||wr
Cable Pull Through|cb|glutes||wr
Cable Pullover|cb|back||wr
Cable Side Bend|cb|core||wr
Cable Shrug|cb|traps||wr
Cable Triceps Kickback|cb|triceps||wr
Cable Triceps Pushdown|cb|triceps||wr
Cable Wood Chop|cb|core||wr
Calf Press on Leg Press|mc|calves||wr
Captain's Chair Leg Raise|bar,bw|core||bwr
Chest Dip|bw|chest||bwr
Chest Dip (Weighted)|bw|chest||wbw
Chest Fly (Cable)|cb|chest||wr
Chest Fly (Dumbbell)|db|chest||wr
Chest Fly (Machine)|mc|chest||wr
Chest Press (Machine)|mc|chest||wr
Chest-Supported Row|ot|back||wr
Chest-Supported Incline Row (Dumbbell)|db|back||wr
Chin Up|bar,bw|biceps||bwr
Chin Up (Weighted)|bar,bw|biceps||wbw
Clamshell|bw|glutes||bwr
Clean|bb|full_body||wr
Clean and Jerk|bb|full_body||wr
Clean and Press|bb|full_body||wr
Clean High Pull|bb|back||wr
Clean Pull|bb|back||wr
Close Grip Bench Press|bb|triceps||wr
Close Grip Lat Pulldown|cb|back||wr
Close Grip Seated Cable Row|cb|back||wr
Concentration Curl|ot|biceps||wr
Copenhagen Plank|bw|adductors||dur
Copenhagen Plank (Short Lever)|bw|adductors||dur
Cross Body Cable Triceps Extension|cb|triceps||wr
Cross Body Hammer Curl|ot|biceps||wr
Crunch|bw|core||bwr
Crunch (Weighted)|bw|core||wbw
Cuban Press|ot|shoulders||wr
Cuban Rotation|ot|rotator_cuff||wr
Cycling|mc|cardio||dur
Dead Bug|bw|core||bwr
Deadlift (Barbell)|bb|back||wr
Deadlift (Dumbbell)|db|back||wr
Decline Bench Press (Barbell)|bb|chest||wr
Decline Bench Press (Dumbbell)|db|chest||wr
Decline Crunch|bw|core||bwr
Decline Push Up|bw|chest||bwr
Decline Sit Up|bw|core||bwr
Deficit Deadlift|bb|back||wr
Deficit Romanian Deadlift|bb|hamstrings||wr
Devil Press|ot|full_body||wr
Diamond Push Up|bw|triceps||bwr
Dip|bw|triceps||bwr
Donkey Calf Raise|bb|calves||wr
Donkey Kick|bw|glutes||bwr
Double Kettlebell Swing|kb|glutes||wr
Drag Curl|bb|biceps||wr
Dumbbell Clean and Press|db|full_body||wr
Dumbbell Floor Press|db|chest||wr
Dumbbell Hip Thrust|db|glutes||wr
Dumbbell Kickback|db|triceps||wr
Dumbbell Lunge|db|legs||wr
Dumbbell Pullover|db|back||wr
Dumbbell Row|db|back||wr
Dumbbell Side Bend|db|core||wr
Dumbbell Skullcrusher|db|triceps||wr
Dumbbell Thruster|db|full_body||wr
Dumbbell Windshield Wipers|db|core||wr
Easy Bar Curl|bb|biceps||wr
Elliptical|mc|cardio||dur
Face Pull|cb|rear_delts||wr
Face Pull (Cable)|cb|rear_delts||wr
Farmer's Carry|bw|forearms||durw
Farmer's Walk|bw|forearms||durw
Front Foot Elevated Split Squat|ot|legs||wr
Front Lever|bar,bw|back||dur
Front Lever Raise|bar,bw|core||bwr
Front Raise (Cable)|cb|front_delts||wr
Front Raise (Dumbbell)|db|front_delts||wr
Front Raise (Plate)|ot|front_delts||wr
Front Squat|bb|legs||wr
Frog Pump|bw|glutes||bwr
Glute Bridge|bb|glutes||bwr
Glute Bridge (Barbell)|bb|glutes||wr
Glute Ham Raise|ot|hamstrings||wr
Glute Kickback|ot|glutes||wr
Glute Kickback (Cable)|cb|glutes||wr
Glute Kickback (Machine)|mc|glutes||wr
Glute Kickback on Floor|ot|glutes||wr
Glute Medius Kickback|ot|glutes||wr
Good Morning (Barbell)|bb|hamstrings||wr
Good Morning (Smith Machine)|mc|hamstrings||wr
Gripper|ot|forearms||wr
Hack Squat|mc|legs||wr
Hack Squat (Machine)|mc|legs||wr
Hammer Curl (Dumbbell)|db|biceps||wr
Hand Gripper|ot|forearms||wr
Handstand Push Up|bw|shoulders||bwr
Hang Clean|bb|full_body||wr
Hang Clean Pull|bb|back||wr
Hang Power Clean|bb|full_body||wr
Hang Snatch|bb|full_body||wr
Hanging Knee Raise|bar,bw|core||bwr
Hanging Knee Raise (Weighted)|bar,bw|core||wbw
Hanging Windshield Wipers|bar,bw|core||bwr
High Knees|bw|cardio||dur
High Pull|ot|back||wr
High to Low Cable Woodchop|cb|core||wr
Hindu Push Up|bw|chest||bwr
Hip Abduction (Cable)|mc|glutes||wr
Hip Abduction (Machine)|mc|glutes||wr
Hip Adduction (Machine)|mc|adductors||wr
Hip Thrust|bb|glutes||wr
Hip Thrust (Barbell)|bb|glutes||wr
Hip Thrust (Dumbbell)|db|glutes||wr
Hip Thrust (Machine)|mc|glutes||wr
Hollow Body Hold|bw|core||dur
Human Flag|bar,bw|core||dur
Hyperextension|ot|lower_back||wr
Incline Bench Press (Barbell)|bb|chest||wr
Incline Bench Press (Dumbbell)|db|chest||wr
Incline Cable Fly|cb|chest||wr
Incline Chest Fly (Dumbbell)|db|chest||wr
Incline Chest Press (Machine)|mc|chest||wr
Incline Dumbbell Curl|db|biceps||wr
Incline Push Up|bw|chest||bwr
Inverted Row|bw|back||bwr
Inverted Row (Weighted)|bw|back||wbw
Jackknife Sit Up|bar,bw|core||bwr
Jefferson Deadlift|bb|back||wr
JM Press|bb|triceps||wr
Jump Rope|ot|cardio||dur
Jump Squat|bw|legs||bwr
Jumping Jacks|bw|cardio||dur
Jumping Lunge|bw|legs||bwr
Kettlebell Clean|kb|full_body||wr
Kettlebell Clean and Press|kb|full_body||wr
Kettlebell Deadlift|kb|glutes||wr
Kettlebell Figure 8|kb|core||wr
Kettlebell Floor Press|kb|chest||wr
Kettlebell Front Rack Squat|kb|legs||wr
Kettlebell Goblet Squat|kb|legs||wr
Kettlebell Halo|kb|shoulders||wr
Kettlebell Lunge|kb|legs||wr
Kettlebell Press|kb|shoulders||wr
Kettlebell Romanian Deadlift|kb|hamstrings||wr
Kettlebell Row|kb|back||wr
Kettlebell Snatch|kb|full_body||wr
Kettlebell Swing|kb|glutes||wr
Kettlebell Thruster|kb|full_body||wr
Kettlebell Windmill|kb|core||wr
Kickback (Dumbbell)|db|triceps||wr
Kneeling Ab Wheel Rollout|bw|core||bwr
Kneeling Cable Crunch|cb|core||wr
Kneeling Cable Woodchop|cb|core||wr
Kroc Row|bb|back||wr
Larsen Press|bb|chest||wr
Landmine Press|bb|shoulders||wr
Landmine Squat|bb|legs||wr
Lateral Leg Raises|bw|glutes||bwr
Lateral Neck Raise|ot|neck||bwr
Leaning Lateral Raise|ot|shoulders||wr
Leg Curl (Machine)|mc|hamstrings||wr
Leg Extension (Machine)|mc|legs||wr
Leg Press (45 Degrees)|mc|legs||wr
Leg Press (Machine)|mc|legs||wr
Leg Press (Single Leg)|mc|legs||wr
Leg Press Calf Raise|mc|calves||wr
Low Bar Squat|bb|legs||wr
Low Cable Fly|cb|chest||wr
Low to High Cable Woodchop|cb|core||wr
Lying Knee Raise|bw|core||bwr
Lying Leg Curl|mc|hamstrings||wr
Lying Leg Raise|bw|core||bwr
Lying Triceps Extension|ot|triceps||wr
Machine Bicep Curl|mc|biceps||wr
Machine Triceps Extension|mc|triceps||wr
Man Maker|ot|full_body||wr
Meadows Row|bb|back||wr
Military Press|bb|shoulders||wr
Mindful Walking|bw|cardio||dur
Mixed Grip Deadlift|bb|back||wr
Muscle Snatch|bb|full_body||wr
Muscle Up|bar,bw|back||bwr
Mountain Climbers|bw|core||bwr
Neck Bridge|ot|neck||bwr
Neck Curl|ot|neck||wr
Neck Extension|ot|neck||bwr
Neck Flexion|ot|neck||bwr
Neck Harness Extension|ot|neck||wr
Neck Harness Flexion|ot|neck||wr
Neck Rotation|ot|neck||bwr
Neck Side Flexion|ot|neck||bwr
Neutral Grip Pull Up|bar,bw|back||bwr
One Arm Triceps Pushdown|cb|triceps||wr
One-Arm Dumbbell Row|db|back||wr
One-Arm Kettlebell Swing|kb|glutes||wr
One-Arm Landmine Press|bb|shoulders||wr
One-Arm Push-Up|bw|chest||bwr
One-Arm Tricep Extension (Dumbbell)|db|triceps||wr
Overhead Press (Barbell)|bb|shoulders||wr
Overhead Press (Dumbbell)|db|shoulders||wr
Overhead Squat|bb|legs||wr
Overhead Triceps Extension (Cable)|cb|triceps||wr
Overhead Triceps Extension (Dumbbell)|db|triceps||wr
Pallof Press|cb|core||wr
Pendlay Row|bb|back||wr
Pendulum Squat|mc|legs||wr
Pike Push Up|bw|shoulders||bwr
Pin Press|bb|chest||wr
Pinwheel Curl|ot|biceps||wr
Pistol Squat|bw|legs||bwr
Plate Pinch|ot|forearms||wr
Plate-Loaded Chest Press|mc|chest||wr
Prone T Raise|ot|rear_delts||wr
Prone W Raise|ot|rear_delts||wr
Prone Y Raise|ot|rear_delts||wr
Preacher Curl (Barbell)|bb|biceps||wr
Preacher Curl (Dumbbell)|db|biceps||wr
Preacher Curl (Machine)|mc|biceps||wr
Power Clean|bb|full_body||wr
Power Jerk|bb|full_body||wr
Power Snatch|bb|full_body||wr
Power Shrug|bb|traps||wr
Preacher Curl|bb|biceps||wr
Push Press|bb|shoulders||wr
Push Up|bw|chest||bwr
Rack Pull|bb|back||wr
Rear Delt Fly (Dumbbell)|db|rear_delts||wr
Rear Delt Fly (Cable)|cb|rear_delts||wr
Rear Delt Row|ot|rear_delts||wr
Reverse Curl (Barbell)|bb|forearms||wr
Reverse Curl (Dumbbell)|db|forearms||wr
Reverse Curl (EZ Bar)|bb|forearms||wr
Reverse Grip Lat Pulldown|cb|back||wr
Reverse Grip Triceps Pushdown|cb|triceps||wr
Reverse Hyperextension|ot|glutes||wr
Reverse Lunge|bw|legs||bwr
Reverse Pec Deck|mc|rear_delts||wr
Reverse Wrist Curl (Barbell)|bb|forearms||wr
Reverse Wrist Curl (Dumbbell)|db|forearms||wr
Razor Curl|ot|hamstrings||wr
Renegade Row|ot|back||wr
Resistance Band Pull Apart|band|rear_delts||bwr
Romanian Deadlift (Barbell)|bb|hamstrings||wr
Romanian Deadlift (Dumbbell)|db|hamstrings||wr
Rotary Torso (Machine)|mc|core||wr
Rowing Machine|mc|cardio||dur
Russian Twist|ot|core||wr
Russian Twist (Weighted)|bw|core||wbw
Running|bw|cardio||dur
RKC Plank|bw|core||dur
Scapular Pull Up|bar,bw|back||bwr
Scapular Push Up|bw|chest||bwr
Seated Calf Raise (Machine)|mc|calves||wr
Seated Dumbbell Curl|db|biceps||wr
Seated Leg Curl|mc|hamstrings||wr
Seated Lateral Raise (Dumbbell)|db|shoulders||wr
Seated Shoulder Press (Dumbbell)|db|shoulders||wr
Seated Shoulder Press (Machine)|mc|shoulders||wr
Seated Triceps Extension|ot|triceps||wr
Seated Wrist Extension (Barbell)|bb|forearms||wr
Seated Wrist Curl (Barbell)|bb|forearms||wr
Seal Row|bb|back||wr
Serratus Punch|bw|chest||bwr
Shoulder External Rotation|ot|rotator_cuff||wr
Shoulder Internal Rotation|ot|rotator_cuff||wr
Shoulder Press (Machine)|mc|shoulders||wr
Shuttle Run|bw|cardio||dur
Side Plank|bw|core||dur
Single Arm Cable Row|cb|back||wr
Single Arm Dumbbell Row|db|back||wr
Single Arm Kettlebell Swing|kb|glutes||wr
Single Arm Lat Pulldown|cb|back||wr
Single Arm Landmine Press|bb|shoulders||wr
Single Leg Calf Raise|ot|calves||wr
Single Leg Calf Raise (Dumbbell)|db|calves||wr
Single Leg Curl|mc|hamstrings||wr
Single Leg Glute Bridge|bw|glutes||bwr
Single Leg Romanian Deadlift|ot|hamstrings||wr
Sissy Squat|bw|legs||bwr
Sit Up|bw|core||bwr
Sit Up (Weighted)|bw|core||wbw
Ski Erg|mc|cardio||dur
Skipping|ot|cardio||dur
Skullcrusher (Barbell)|bb|triceps||wr
Skullcrusher (EZ Bar)|bb|triceps||wr
Sled Push|ot|full_body||durw
Sled Pull|ot|full_body||durw
Smith Machine Bench Press|mc|chest||wr
Smith Machine Calf Raise|mc|calves||wr
Smith Machine Incline Bench Press|mc|chest||wr
Smith Machine Romanian Deadlift|mc|hamstrings||wr
Smith Machine Shoulder Press|mc|shoulders||wr
Smith Machine Squat|mc|legs||wr
Snatch|bb|full_body||wr
Snatch Grip Deadlift|bb|back||wr
Snatch Pull|bb|back||wr
Spanish Squat|bw|legs||bwr
Spider Curl (Barbell)|bb|biceps||wr
Spider Curl (Dumbbell)|db|biceps||wr
Spoto Press|bb|chest||wr
Split Jerk|bb|full_body||wr
Split Squat|bw|legs||bwr
Sprint|bw|cardio||dur
Standing Calf Raise|ot|calves||wr
Standing Calf Raise (Machine)|mc|calves||wr
Standing Dumbbell Curl|db|biceps||wr
Standing Leg Curl|mc|hamstrings||wr
Standing Lateral Raise (Dumbbell)|db|shoulders||wr
Standing Shoulder Press|ot|shoulders||wr
Standing Tibialis Raise|bw|tibialis||bwr
Standing Triceps Extension|ot|triceps||wr
Standing Wrist Curl (Barbell)|bb|forearms||wr
Standing Wrist Extension (Barbell)|bb|forearms||wr
Standing Ab Wheel Rollout|bw|core||bwr
Stationary Bike|mc|cardio||dur
Step Up|bw|legs||bwr
Stiff Leg Deadlift|bb|hamstrings||wr
Straight Arm Pulldown|cb|back||wr
Sumo Deadlift|bb|glutes||wr
Sumo Squat (Barbell)|bb|legs||wr
Superman|bw|lower_back||bwr
Svend Press|bb|chest||wr
Swimming|bw|cardio||dur
T-Bar Row|bb|back||wr
T-Bar Row (Machine)|mc|back||wr
Tate Press|bb|triceps||wr
Thruster (Barbell)|bb|full_body||wr
Tibialis Raise|bw|tibialis||bwr
Tire Flip|ot|full_body||wr
Toes to Bar|bar,bw|core||bwr
Towel Hang|bar,bw|forearms||dur
Trap Bar Carry|bb|forearms||durw
Trap Bar Deadlift|bb|legs|glutes|wr
Triceps Dip|bw|triceps||bwr
Triceps Dip (Weighted)|bw|triceps||wbw
Triceps Extension (Cable)|cb|triceps||wr
Triceps Extension (Dumbbell)|db|triceps||wr
Triceps Extension (Barbell)|bb|triceps||wr
Triceps Pushdown|cb|triceps||wr
Triceps Pushdown (Rope)|cb|triceps||wr
Triceps Pushdown (V-Bar)|cb|triceps||wr
Turkish Get Up|ot|full_body||wr
Upright Row (Barbell)|bb|shoulders||wr
Upright Row (Cable)|cb|shoulders||wr
Upright Row (Dumbbell)|db|shoulders||wr
V-Up|bw|core||bwr
VersaClimber|mc|cardio||dur
Walking|bw|cardio||dur
Walking Lunge|bw|legs||bwr
Wall Ball|ot|full_body||wr
Wall Slides|bw|shoulders||bwr
Wall Sit|bw|legs||dur
Wall Walk|bw|shoulders||dur
Wrist Curl (Barbell)|bb|forearms||wr
Wrist Curl (Dumbbell)|db|forearms||wr
Wrist Extension|bb|forearms||wr
Wrist Flexion|bb|forearms||wr
Wrist Roller|ot|forearms||wr
Windshield Wipers|bar,bw|core||bwr
Wood Chop (Cable)|cb|core||wr
Zercher Carry|bb|full_body||durw
Zercher Deadlift|bb|back||wr
Zercher Squat|bb|legs||wr
Zercher Squat (Barbell)|bb|legs||wr
Z Press|ot|shoulders||wr
Zottman Curl|ot|biceps||wr
Decline Dumbbell Flyes|db|chest||wr
High Cable Crossover|cb|chest||wr
Landmine Chest Press|bb|chest||wr
Barbell Floor Press|bb|chest||wr
Squeeze Press (Hex Press)|db|chest||wr
Single-Arm Cable Chest Press|cb|chest||wr
Plyometric Push-Up|bw|chest||bwr
Clapping Push-Up|bw|chest||bwr
Ring Dips|ot|chest||wr
Ring Push-Ups|ot|chest||wr
Guillotine Press|bb|chest||wr
Kettlebell Flyes|kb|chest||wr
Yates Row|bb|back||wr
Lat Pulldown (Wide Grip)|cb|back||wr
Seated Cable Row|cb|back||wr
Weighted Pull-Up|bar|back||wbw
Dumbbell Shrug|db|back||wr
Machine Shrug|mc|back||wr
Smith Machine Row|mc|back||wr
Kettlebell Gorilla Row|kb|back||wr
Machine Lateral Raise|mc|shoulders||wr
Barbell Front Raise|bb|shoulders||wr
Kettlebell Bottoms-Up Press|kb|shoulders||wr
Bradford Press|bb|shoulders||wr
Lu Raises|db|shoulders||wr
Behind-the-Neck Press|bb|shoulders||wr
Cable Hammer Curl (Rope)|cb|biceps||wr
Overhead Cable Curl|cb|biceps||wr
Kettlebell Bicep Curl|kb|biceps||wr
Waiters Curl|db|biceps||wr
Bench Dips|bw|triceps||bwr
Single-Arm Cable Tricep Extension|cb|triceps||wr
Machine Tricep Dip|mc|triceps||wr
Barbell Farmer Walk|bb|forearms||durw
Kettlebell Farmer Walk|kb|forearms||durw
Reverse Grip Cable Curl|cb|forearms||wr
Bulgarian Split Squat (Dumbbell)|db|legs||wr
Bulgarian Split Squat (Barbell)|bb|legs||wr
Walking Lunge (Dumbbells)|db|legs||wr
Walking Lunge (Barbell)|bb|legs||wr
Box Squat|bb|legs||wr
Cyclist Squat (Heels Elevated)|bb|legs||wr
Belt Squat Machine|mc|legs||wr
Decline Bench Weighted Crunch|db|core||wr
Dragon Flag|bw|core||bwr
Curtsy Lunge|db|glutes||wr
Single-Leg Hip Thrust|bw|glutes||bwr
Monster Walk (Lateral Band Walk)|ot|glutes||wr
Swiss Ball Leg Curl|ot|hamstrings||wr
Standing Dumbbell Calf Raise|db|calves||wr
Barbell Tibialis Raise|bb|calves||wr
Double Kettlebell Clean|kb|full_body||wr
Box Jump|ot|full_body||wr
Broad Jump|bw|full_body||bwr
Battle Ropes Slam|ot|full_body||wr`;
const LIB2 = {};
LIB2_RAW.split("\n").forEach((ln) => {
  const f = ln.split("|");
  if (f.length < 5) return;
  EXLIB.push([f[0], f[0]]);
  LIB2[norm(f[0])] = { eq: f[1].split(","), p: [f[2]], s: f[3] ? [f[3]] : [], ty: f[4] };
});
