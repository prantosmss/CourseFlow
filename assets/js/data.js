/* CourseFlow portal — demo seed data and in-memory application state */

function createInitialState(){
  const now=new Date().toISOString();
  const yesterday=new Date(Date.now()-86400000).toISOString();
  const earlier=new Date(Date.now()-2*86400000).toISOString();
  const courses=[
    {code:"CSE101",title:"Introduction to Programming",dept:"CSE",credits:3,prereq:[],active:true,description:"Foundations of programming with Python, problem solving and algorithmic thinking."},
    {code:"CSE201",title:"Data Structures",dept:"CSE",credits:3,prereq:["CSE101"],active:true,description:"Arrays, lists, stacks, queues, trees and graphs with complexity analysis."},
    {code:"CSE301",title:"Algorithms",dept:"CSE",credits:3,prereq:["CSE201"],active:true,description:"Design and analysis of algorithms, divide and conquer, greedy and dynamic programming."},
    {code:"CSE305",title:"Database Systems",dept:"CSE",credits:3,prereq:["CSE101"],active:true,description:"Relational modelling, SQL, normalization and transaction processing."},
    {code:"CSE310",title:"Web Technologies",dept:"CSE",credits:3,prereq:["CSE101"],active:true,description:"Modern web development with HTML, CSS, JavaScript and responsive design."},
    {code:"CSE330",title:"Machine Learning",dept:"CSE",credits:3,prereq:[],active:true,description:"Supervised and unsupervised learning with practical model evaluation."},
    {code:"CSE340",title:"Cyber Security",dept:"CSE",credits:3,prereq:["CSE101"],active:true,description:"Security fundamentals, threat models, cryptography and network defence."},
    {code:"MAT101",title:"Calculus",dept:"MAT",credits:3,prereq:[],active:true,description:"Limits, derivatives, integrals and applications for engineering."},
    {code:"MAT201",title:"Linear Algebra",dept:"MAT",credits:3,prereq:["MAT101"],active:true,description:"Vector spaces, matrices, eigenvalues and linear transformations."},
    {code:"ENG101",title:"English Composition",dept:"ENG",credits:3,prereq:[],active:true,description:"Academic reading, writing and argumentation for university study."},
    {code:"ENG201",title:"Academic Writing",dept:"ENG",credits:3,prereq:["ENG101"],active:true,description:"Research writing, citation and advanced composition."},
    {code:"EEE101",title:"Electrical Circuits I",dept:"EEE",credits:3,prereq:[],active:true,description:"DC circuit analysis, Kirchhoff's laws, network theorems and transients."},
    {code:"EEE201",title:"Electrical Circuits II",dept:"EEE",credits:4,prereq:["EEE101"],active:true,description:"AC circuit analysis, phasors, resonance and three-phase systems."},
    {code:"BBA101",title:"Principles of Management",dept:"BBA",credits:3,prereq:[],active:true,description:"Management functions, organisational behaviour and decision making."},
    {code:"BBA201",title:"Marketing Management",dept:"BBA",credits:3,prereq:["BBA101"],active:true,description:"Consumer behaviour, market segmentation, branding and marketing strategy."},
    {code:"BBA210",title:"Financial Accounting",dept:"BBA",credits:3,prereq:[],active:true,description:"Accounting cycle, financial statements and reporting standards."}
  ];
  const offerings=[
    {id:"OFF-CSE101-01",code:"CSE101",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"A",instructor:"Tanvir Ahmed",room:"CSE-201",capacity:40,enrolled:38},
    {id:"OFF-CSE201-01",code:"CSE201",section:"01",semester:"Fall 2026",days:["Mon","Wed"],slot:"B",instructor:"Dr. Farhana Islam",room:"CSE-402",capacity:32,enrolled:28},
    {id:"OFF-CSE301-01",code:"CSE301",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"E",instructor:"Dr. Rezaul Karim",room:"CSE-305",capacity:18,enrolled:12},
    {id:"OFF-CSE305-01",code:"CSE305",section:"01",semester:"Fall 2026",days:["Mon","Wed"],slot:"B",instructor:"Sadia Noor",room:"CSE-306",capacity:25,enrolled:20},
    {id:"OFF-CSE310-01",code:"CSE310",section:"01",semester:"Fall 2026",days:["Mon","Wed"],slot:"C",instructor:"Imran Hossain",room:"CSE-210",capacity:24,enrolled:12},
    {id:"OFF-CSE330-01",code:"CSE330",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"A",instructor:"Dr. Mehedi Hasan",room:"CSE-401",capacity:30,enrolled:26},
    {id:"OFF-CSE340-01",code:"CSE340",section:"01",semester:"Fall 2026",days:["Thu"],slot:"A",instructor:"Nusrat Jahan",room:"CSE-307",capacity:20,enrolled:15},
    {id:"OFF-MAT101-01",code:"MAT101",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"B",instructor:"Ayesha Siddiqua",room:"MAT-102",capacity:45,enrolled:41},
    {id:"OFF-MAT201-01",code:"MAT201",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"D",instructor:"Dr. Alamgir Hossain",room:"MAT-204",capacity:35,enrolled:30},
    {id:"OFF-ENG101-01",code:"ENG101",section:"01",semester:"Fall 2026",days:["Mon","Wed"],slot:"D",instructor:"Shahriar Kabir",room:"ENG-101",capacity:40,enrolled:36},
    {id:"OFF-ENG201-01",code:"ENG201",section:"01",semester:"Fall 2026",days:["Mon","Wed"],slot:"D",instructor:"Farzana Yasmin",room:"ENG-203",capacity:30,enrolled:24},
    {id:"OFF-EEE101-01",code:"EEE101",section:"01",semester:"Fall 2026",days:["Wed"],slot:"C",instructor:"Dr. Mahmudul Hasan",room:"EEE-105",capacity:30,enrolled:22},
    {id:"OFF-EEE201-01",code:"EEE201",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"E",instructor:"Dr. Mahmudul Hasan",room:"EEE-201",capacity:20,enrolled:8},
    {id:"OFF-BBA101-01",code:"BBA101",section:"01",semester:"Fall 2026",days:["Thu"],slot:"B",instructor:"Rubaiyat Hossain",room:"BBA-301",capacity:50,enrolled:45},
    {id:"OFF-BBA201-01",code:"BBA201",section:"01",semester:"Fall 2026",days:["Thu"],slot:"B",instructor:"Samantha Chowdhury",room:"BBA-204",capacity:30,enrolled:30},
    {id:"OFF-BBA210-01",code:"BBA210",section:"01",semester:"Fall 2026",days:["Sun","Tue"],slot:"C",instructor:"Kazi Arif",room:"BBA-105",capacity:35,enrolled:29}
  ];
  const regs=[
    {id:"REG-1001",studentId:"2024001",offeringId:"OFF-CSE201-01",status:"Approved",paymentStatus:"Paid",createdAt:earlier,decidedAt:earlier,remark:null,txnId:"TXN-884201"},
    {id:"REG-1002",studentId:"2024001",offeringId:"OFF-MAT201-01",status:"Approved",paymentStatus:"Paid",createdAt:earlier,decidedAt:earlier,remark:null,txnId:"TXN-884201"},
    {id:"REG-1003",studentId:"2024001",offeringId:"OFF-ENG201-01",status:"Approved",paymentStatus:"Paid",createdAt:earlier,decidedAt:earlier,remark:null,txnId:"TXN-884201"},
    {id:"REG-1004",studentId:"2024001",offeringId:"OFF-BBA210-01",status:"Approved",paymentStatus:"Paid",createdAt:earlier,decidedAt:earlier,remark:null,txnId:"TXN-884201"},
    {id:"REG-1005",studentId:"2024001",offeringId:"OFF-CSE330-01",status:"Approved",paymentStatus:"Paid",createdAt:earlier,decidedAt:earlier,remark:null,txnId:"TXN-884201"},
    {id:"REG-2001",studentId:"2024002",offeringId:"OFF-CSE340-01",status:"Pending",paymentStatus:"Unpaid",createdAt:yesterday,remark:null},
    {id:"REG-2002",studentId:"2024003",offeringId:"OFF-CSE310-01",status:"Pending",paymentStatus:"Unpaid",createdAt:earlier,remark:null},
    {id:"REG-2003",studentId:"2024004",offeringId:"OFF-CSE305-01",status:"Pending",paymentStatus:"Unpaid",createdAt:earlier,remark:null}
  ];
  const users=[
    {id:"2024001",name:"Ayaan Rahman",password:"student123",role:"student",dept:"CSE",advisorId:"ADV01",active:true,completed:["CSE101","MAT101","ENG101","EEE101","BBA101"]},
    {id:"2024002",name:"Nabila Islam",password:"student123",role:"student",dept:"CSE",advisorId:"ADV01",active:true,completed:["CSE101","CSE201","MAT101","ENG101"]},
    {id:"2024003",name:"Rafiul Hasan",password:"student123",role:"student",dept:"CSE",advisorId:"ADV01",active:true,completed:["CSE101","CSE201","MAT101","ENG101"]},
    {id:"2024004",name:"Tasnim Akter",password:"student123",role:"student",dept:"EEE",advisorId:"ADV02",active:true,completed:["EEE101","MAT101","ENG101"]},
    {id:"ADV01",name:"Dr. Nusrat Jahan",password:"advisor123",role:"advisor",dept:"CSE",active:true,adviseeIds:["2024001","2024002","2024003"]},
    {id:"ADV02",name:"Dr. Kamrul Hasan",password:"advisor123",role:"advisor",dept:"EEE",active:true,adviseeIds:["2024004"]},
    {id:"ADMIN",name:"Registrar Office",password:"admin123",role:"admin",dept:"Administration",active:true}
  ];
  return {
    currentUser:null,route:"dashboard",users,courses,offerings,registrations:regs,
    transactions:[{id:"TXN-884201",studentId:"2024001",amount:67500,method:"bKash",date:earlier,status:"Success",receipt:"RCPT-2026-1008",regIds:["REG-1001","REG-1002","REG-1003","REG-1004","REG-1005"]}],
    notifications:[
      {id:"NTF-1",userId:"2024001",title:"Registration window is open",body:"Fall 2026 registration closes on "+dateLong(dateOffset(11))+" · SMS + email sent.",type:"info",read:false,at:now},
      {id:"NTF-2",userId:"ADV01",title:"2 approvals waiting",body:"Two advisees have submitted registration requests for your review.",type:"warn",read:false,at:yesterday},
      {id:"NTF-3",userId:"ADMIN",title:"Term setup complete",body:"Fall 2026 registration and drop dates are configured.",type:"success",read:false,at:earlier}
    ],
    settings:{semester:"Fall 2026",registrationOpen:dateOffset(-9),registrationClose:dateOffset(11),dropDeadline:dateOffset(25),paymentDue:dateOffset(21),feePerCredit:FEE_RATE},
    search:"",department:"all",adminTab:"courses",
    payment:{method:"bkash",details:{mobile:"01712345678",card:"4242 4242 4242 4242",expiry:"12/28",cvc:"123"},gateway:null,result:null},
    login:{attempts:{},lockedUntil:{}},
    ui:{sidebarOpen:false,guideOpen:false}
  };
}
let state=createInitialState();
