
var express = require("express");
var app = express();
var pg = require('pg');
var nodemailer = require("nodemailer");
var request = require("request");
var cheerio = require("cheerio");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);

var config = {
	user: 'postgres',
	database: 'da',
	password: 'emkoga189215',
	host: '127.0.0.1',
	port: 5432,
	max: 20,
	idleTimeoutMillis: 100000,
};

var pool = new pg.Pool(config);


//Send Email
var d = new Date();
const dateRP = d.getDate() +"/"+ parseInt(d.getMonth()+1) +"/"+ d.getFullYear();
const timeNow = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

function sendEmail(){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		
		const data1 = await client.query("SELECT * FROM giaoduc_data WHERE doadd = '"+dateRP+"'");
		const data2 = await client.query("SELECT * FROM xahoi_data WHERE doadd = '"+dateRP+"'");
		const data3 = await client.query("SELECT * FROM phapluat_data WHERE doadd = '"+dateRP+"'");
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'newstar25692@gmail.com',
				pass: 'abcxyz'
			}
		});
		var mailOptions = {
			from: 'THÔNG BÁO TỪ HỆ THỐNG',
			to: 'platiumboy762@gmail.com',
			subject: 'Báo cáo thu thập dữ liệu từ hệ thống ngày '+dateRP+'',
			html: '<p> Tại thời điểm: '+timeNow+' ngày '+dateRP+'</p><br /><p>Đã thu thập thêm:<br />'+data2.rowCount+' Tin xã hội<br />'+data3.rowCount+'  Tin pháp luật<br />'+data1.rowCount+'  Tin giáo dục</p><br /> <a href="http://localhost:3000/admin">Chi tiết</a>'
		};

		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Đã gửi Email: ' + info.response);
			}
		});
	});
}
//sendEmail();
// setInterval(sendEmail, 15000);


//Cap nhat du lieu cac bang
function addDatas(){
	checkAdd("https://vnexpress.net/phap-luat", "phapluat_data");
	checkAdd("https://vnexpress.net/giao-duc", "giaoduc_data");
	checkAdd("https://vnexpress.net/thoi-su", "xahoi_data");
}

// setInterval(addDatas, 10000);

app.get("/updatekey2",function(req, res){
	add2("giaoduc_data", "key2_data");
	add2("phapluat_data", "key2_data");
	add2("xahoi_data", "key2_data");
	res.redirect("/managerPage");
});


app.get("/updatekey3",function(req, res){
	add3("giaoduc_data", "key3_data");
	add3("phapluat_data", "key3_data");
	add3("xahoi_data", "key3_data");
	res.redirect("/managerPage");
});
app.get("/updatekey4",function(req, res){
	add4("giaoduc_data", "key4_data");
	add4("phapluat_data", "key4_data");
	add4("xahoi_data", "key4_data");
	res.redirect("/managerPage");
});


app.get("/keyword", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		const data31 = await client.query("SELECT DISTINCT val FROM key2_data WHERE val IN (SELECT val FROM key2_data GROUP BY val HAVING COUNT(val) >= 3 )");
		const data32 = await client.query("SELECT DISTINCT val FROM key3_data WHERE val IN (SELECT val FROM key3_data GROUP BY val HAVING COUNT(val) >= 3 )");
		const data33 = await client.query("SELECT DISTINCT val FROM key4_data WHERE val IN (SELECT val FROM key4_data GROUP BY val HAVING COUNT(val) >= 3 )");

		const data51 = await client.query("SELECT DISTINCT val FROM key2_data WHERE val IN (SELECT val FROM key2_data GROUP BY val HAVING COUNT(val) >= 5 )");
		const data52 = await client.query("SELECT DISTINCT val FROM key3_data WHERE val IN (SELECT val FROM key3_data GROUP BY val HAVING COUNT(val) >= 5 )");
		const data53 = await client.query("SELECT DISTINCT val FROM key4_data WHERE val IN (SELECT val FROM key4_data GROUP BY val HAVING COUNT(val) >= 5 )");

		const data71 = await client.query("SELECT DISTINCT val FROM key2_data WHERE val IN (SELECT val FROM key2_data GROUP BY val HAVING COUNT(val) >= 7 )");
		const data72 = await client.query("SELECT DISTINCT val FROM key3_data WHERE val IN (SELECT val FROM key3_data GROUP BY val HAVING COUNT(val) >= 7 )");
		const data73 = await client.query("SELECT DISTINCT val FROM key4_data WHERE val IN (SELECT val FROM key4_data GROUP BY val HAVING COUNT(val) >= 7 )");

		const data91 = await client.query("SELECT DISTINCT val FROM key2_data WHERE val IN (SELECT val FROM key2_data GROUP BY val HAVING COUNT(val) >= 9 )");
		const data92 = await client.query("SELECT DISTINCT val FROM key3_data WHERE val IN (SELECT val FROM key3_data GROUP BY val HAVING COUNT(val) >= 9 )");
		const data93 = await client.query("SELECT DISTINCT val FROM key4_data WHERE val IN (SELECT val FROM key4_data GROUP BY val HAVING COUNT(val) >= 9 )");
		
		res.render("key", {key12:data31, key13:data32, key14:data33, key22:data51, key23:data52, key24:data53, key32:data71, key33:data72, key34:data73, key42:data91, key43:data92, key44:data93});
	});
});


// Show data Trang Nhat
app.get("/trangnhat", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data1 = await client.query("SELECT * FROM phapluat_data WHERE id >= (SELECT MAX(id)-3 FROM phapluat_data)");
		const data2 = await client.query("SELECT * FROM xahoi_data WHERE id >= (SELECT MAX(id)-3 FROM xahoi_data)");
		const data3 = await client.query("SELECT * FROM giaoduc_data WHERE id >= (SELECT MAX(id)-4 FROM giaoduc_data)");
		res.render("trangnhat",{pl:data1, xh:data2, gd:data3});
	});
});

//Show data Phap Luat
app.get("/phapluat",function(req, res){
	
	pool.connect(async function(err, client, done){
		
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		
		const data = await client.query("SELECT * FROM phapluat_data WHERE id >= (SELECT MAX(id) - 5 FROM phapluat_data)");
		const data2 = await client.query("SELECT * FROM phapluat_data WHERE id >= (SELECT MAX(id) - 20 FROM phapluat_data)");
		res.render('phapluat',{data:data,data2:data2});
	});
});


//Show data Xa Hoi
app.get("/xahoi", function(req, res){
	
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM xahoi_data WHERE id >= (SELECT MAX(id) - 5 FROM xahoi_data)");
		const data2 = await client.query("SELECT * FROM xahoi_data WHERE id >= (SELECT MAX(id) - 20 FROM xahoi_data)");
		res.render('xahoi',{data:data,data2:data2});
	});
});

//Show data Giao Duc
app.get("/giaoduc", function(req, res){
	
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM giaoduc_data WHERE id >= (SELECT MAX(id) - 5 FROM giaoduc_data)");
		const data2 = await client.query("SELECT * FROM giaoduc_data WHERE id >= (SELECT MAX(id) - 20 FROM giaoduc_data)");
		res.render("giaoduc",{data:data,data2:data2});
	});
});

//DI toi trang quan tri
app.get("/managerPage", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM xahoi_data");
		const data2 = await client.query("SELECT * FROM giaoduc_data");
		const data3 = await client.query("SELECT * FROM phapluat_data");
		
		res.render('managerPage',{data:data, data2:data2, data3:data3});
	});
});

//Di toi trang dang nhap
app.get("/admin", function(req, res){
	pool.connect( async function(err, client, done){
		if(err){
			return console.err('Error fetching client from Pool', err);
		}
		const data = await client.query("SELECT * FROM admin_data");
		res.render("admin", {data:data});
	});
	
});

//API DATA JSON
app.get("/api", function(req, res){
	res.render("api");
})
//excel
var nodeExcel = require('excel-export');
app.get("/phapluatXLSX", function(req, res){
	const excel = require('node-excel-export');
    const styles = {
	  headerDark: {
	    fill: {
	      fgColor: {
	        rgb: 'FF000000'
	      }
	    },
	    font: {
	      color: {
	        rgb: 'FFFFFFFF'
	      },
	      sz: 14,
	      bold: true,
	      underline: true
	    }
	  },
	  cellPink: {
	    fill: {
	      fgColor: {
	        rgb: 'FFFFCCFF'
	      }
	    }
	  },
	  cellGreen: {
	    fill: {
	      fgColor: {
	        rgb: 'FF00FF00'
	      }
	    }
	  }
	};
	 
	//Array of objects representing heading rows (very top)
	const heading = [
	  ['ID','Tiêu đề','Link bài viết','Link hình ảnh', 'Ngày thu thập', 'Tình trạng']
	];
	 
	//Here you specify the export structure
	const specification = {
	  id: {
	    displayName: 'ID',
	    width: 30 // <- width in pixels
	  },
	  vatit: {
	    displayName: 'Tiêu đề',
	    width: 350 // <- width in pixels
	  },
	  plink: {
	    displayName: 'Link bài viết',
	    width: 350 // <- width in pixels
	  },
	  imglink: {
	    displayName: 'Link hình ảnh',
	    width: 350 // <- width in pixels
	  },
	  doadd: {
	    displayName: 'Ngày thu thập',
	    width: 60 // <- width in pixels
	  },
	  crack: {
	    displayName: 'Tình trạng',
	    width: 30 // <- width in pixels
	  }
	}

	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM xahoi_data");
		const dataset = await data.rows;
		const report = excel.buildExport(
		  [ 
		    {
		      name: 'Report', 
		      heading: heading,
		      specification: specification, 
		      data: dataset 
		    }
		  ]
		);
	res.attachment('phapluat_data.xlsx'); 
	return res.send(report);
	});
});

app.get("/giaoducXLSX", function(req, res){
	const excel = require('node-excel-export');
    const styles = {
	  headerDark: {
	    fill: {
	      fgColor: {
	        rgb: 'FF000000'
	      }
	    },
	    font: {
	      color: {
	        rgb: 'FFFFFFFF'
	      },
	      sz: 14,
	      bold: true,
	      underline: true
	    }
	  },
	  cellPink: {
	    fill: {
	      fgColor: {
	        rgb: 'FFFFCCFF'
	      }
	    }
	  },
	  cellGreen: {
	    fill: {
	      fgColor: {
	        rgb: 'FF00FF00'
	      }
	    }
	  }
	};
	 
	//Array of objects representing heading rows (very top)
	const heading = [
	  ['ID','Tiêu đề','Link bài viết','Link hình ảnh', 'Ngày thu thập', 'Tình trạng']
	];
	 
	//Here you specify the export structure
	const specification = {
	  id: {
	    displayName: 'ID',
	    width: 30 // <- width in pixels
	  },
	  vatit: {
	    displayName: 'Tiêu đề',
	    width: 350 // <- width in pixels
	  },
	  plink: {
	    displayName: 'Link bài viết',
	    width: 350 // <- width in pixels
	  },
	  imglink: {
	    displayName: 'Link hình ảnh',
	    width: 350 // <- width in pixels
	  },
	  doadd: {
	    displayName: 'Ngày thu thập',
	    width: 60 // <- width in pixels
	  },
	  crack: {
	    displayName: 'Tình trạng',
	    width: 30 // <- width in pixels
	  }
	}

	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM giaoduc_data");
		const dataset = await data.rows;
		const report = excel.buildExport(
		  [ 
		    {
		      name: 'Report', 
		      heading: heading,
		      specification: specification, 
		      data: dataset 
		    }
		  ]
		);
	res.attachment('giaoduc_data.xlsx'); 
	return res.send(report);
	});
});

app.get("/giaoducXLSX", function(req, res){
	const excel = require('node-excel-export');
    const styles = {
	  headerDark: {
	    fill: {
	      fgColor: {
	        rgb: 'FF000000'
	      }
	    },
	    font: {
	      color: {
	        rgb: 'FFFFFFFF'
	      },
	      sz: 14,
	      bold: true,
	      underline: true
	    }
	  },
	  cellPink: {
	    fill: {
	      fgColor: {
	        rgb: 'FFFFCCFF'
	      }
	    }
	  },
	  cellGreen: {
	    fill: {
	      fgColor: {
	        rgb: 'FF00FF00'
	      }
	    }
	  }
	};
	 
	//Array of objects representing heading rows (very top)
	const heading = [
	  ['ID','Tiêu đề','Link bài viết','Link hình ảnh', 'Ngày thu thập', 'Tình trạng']
	];
	 
	//Here you specify the export structure
	const specification = {
	  id: {
	    displayName: 'ID',
	    width: 30 // <- width in pixels
	  },
	  vatit: {
	    displayName: 'Tiêu đề',
	    width: 350 // <- width in pixels
	  },
	  plink: {
	    displayName: 'Link bài viết',
	    width: 350 // <- width in pixels
	  },
	  imglink: {
	    displayName: 'Link hình ảnh',
	    width: 350 // <- width in pixels
	  },
	  doadd: {
	    displayName: 'Ngày thu thập',
	    width: 60 // <- width in pixels
	  },
	  crack: {
	    displayName: 'Tình trạng',
	    width: 30 // <- width in pixels
	  }
	}

	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		// tạo 1 biến hứng kết quả
		const data = await client.query("SELECT * FROM xahoi_data");
		const dataset = await data.rows;
		const report = excel.buildExport(
		  [ 
		    {
		      name: 'Report', 
		      heading: heading,
		      specification: specification, 
		      data: dataset 
		    }
		  ]
		);
	res.attachment('xahoi_data.xlsx'); 
	return res.send(report);
	});
});


app.get("/api/phapluat_data", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
			res.send({typeInfo:[phapluat_data, xahoi_data, giaoduc_data]})
		}
		client.query("SELECT vatit, plink FROM phapluat_data", function(err, result){
			res.send({data:result.rows});
		})
		
	});
});

app.get("/api/xahoi_data", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
			res.send({typeInfo:[phapluat_data, xahoi_data, giaoduc_data]})
		}
		client.query("SELECT vatit, plink FROM xahoi_data", function(err, result){
			res.send({data:result.rows});
		})
		
	});
});

app.get("/api/giaoduc_data", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
			res.send({typeInfo:[phapluat_data, xahoi_data, giaoduc_data]})
		}
		client.query("SELECT vatit, plink FROM giaoduc_data", function(err, result){
			res.send({data:result.rows});
		})
		
	});
});


app.get("/contact", function(req, res){
	res.render("contact");
});


// JSON API
// request("http://localhost:3000/api/phapluat_data", function(error, response, body){
// 	if(error){
// 		console.log(error, "can not request");
// 	}
// 	$ = cheerio.load(body);
// 	var content = JSON.parse(body);
// 	var i = 0;
// 	content.data.forEach(function(ct){
// 		console.log(i);
// 		console.log(ct.vatit);
// 		console.log(ct.plink);
// 		i++;
// 	})
	
// });





//Check data và add dữ liệu

function checkAdd(linkre, table){
	
	request( linkre , function(error, response, body){
		if(error){
			console.log(error, "Can not REQUEST to SERVER!");
		}else{
			console.log(" REPORT !");
			$ = cheerio.load(body);
			var ds = $(body).find(".list_news > .thumb_art > .thumb_5x3");
			var dsimg = $(body).find(".list_news > .thumb_art > .thumb_5x3 > img.vne_lazy_image");
			var d = new Date();
			var dateAdd = ""+d.getDate() +"/"+ parseInt(d.getMonth()+1) +"/"+ d.getFullYear()+"";
			ds.each(function(i, e){
				var tit = dsimg[i]["attribs"]["alt"].replace(/'/g, '');
				var postLink = e["attribs"]["href"];
				var imgLink = dsimg[i]["attribs"]["data-original"];
				pool.connect(function(err, client, done){
					if(err){
						return console.err('Lỗi kết nối!', err);
					}
					client.query("SELECT * FROM "+table+" WHERE vatit != 'undefined' AND vatit = '"+tit+"'", function(err, result){
						done();
						if(result.rowCount >= 1 || tit == ""){
						console.log(table + " + 0 !");
						}else{
							done();
							client.query("INSERT INTO "+table+"(vatit,plink,imglink,doadd,crack) VALUES ('"+tit+"', '"+postLink+"','"+imgLink+"','"+dateAdd+"','0')");
							console.log(table + " + 1 !");
						}
					});
					
				});
			});
		}
	});
}

//Vao bai viet PL
app.get("/postdetail/:id", function(req, res){
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		var id = req.params.id;

		client.query("SELECT plink FROM phapluat_data WHERE id = '"+id+"'", function(err, result){
			done();
			if(err){
				res.end();
				return console.error("Truy vấn lỗi!");
			}
			request(result.rows[0].plink, function(error, response, body){
				if(error){
					console.log(error);
					res.render("postdetail", {html:"Xảy ra lỗi :'("});
				}else{
					$ = cheerio.load(body);
					var time = $(body).find(".time");
					var title = $(body).find(".title_news_detail");
					var description = $(body).find(".description");
					var content = $(body).find(".content_detail"); 
					res.render("postdetail", {time:time, title:title, des:description, con:content, back: '/phapluat'});
				}
			});
		});
	});
});
//Vao bai viet XH
app.get("/xhdetail/:id", function(req, res){
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		var id = req.params.id;

		client.query("SELECT plink FROM xahoi_data WHERE id = '"+id+"'", function(err, result){
			done();
			if(err){
				res.end();
				return console.error("Truy vấn lỗi!");
			}
			request(result.rows[0].plink, function(error, response, body){
				if(error){
					console.log(error);
					res.render("postdetail", {html:"Xảy ra lỗi :'("});
				}else{
					$ = cheerio.load(body);
					var time = $(body).find(".time");
					var title = $(body).find(".title_news_detail");
					var description = $(body).find(".description");
					var content = $(body).find(".content_detail"); 
					res.render("postdetail", {time:time, title:title, des:description, con:content, back: '/xahoi'});
				}
			});
		});
	});
});
//Vao bai viet GD
app.get("/gddetail/:id", function(req, res){
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		var id = req.params.id;

		client.query("SELECT plink FROM giaoduc_data WHERE id = '"+id+"'", function(err, result){
			done();
			if(err){
				res.end();
				return console.error("Truy vấn lỗi!");
			}
			request(result.rows[0].plink, function(error, response, body){
				if(error){
					console.log(error);
					res.render("postdetail", {html:"Xảy ra lỗi :'("});
				}else{
					$ = cheerio.load(body);
					var time = $(body).find(".time");
					var title = $(body).find(".title_news_detail");
					var description = $(body).find(".description");
					var content = $(body).find(".content_detail"); 
					res.render("postdetail", {time:time, title:title, des:description, con:content, back: '/giaoduc'});
				}
			});
		});
	});
});
//Add key 2 tu
function add2(tableCr, tableKey){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query(" SELECT * FROM "+tableCr+" WHERE crack != '1' AND crack != '2' AND crack != '3' ", function(err, result){
			done();
			if(err){
				return console.error("Truy vấn lỗi!");
			}
			if(result.rowCount == 0){
				console.log("Không có dữ liệu mới để thêm cho key 2!");
			}else{
				for(var i = 0; i < result.rowCount; i++){
					tach2(result.rows[i].vatit+" ", result.rows[i].plink, tableKey);
					client.query("UPDATE "+tableCr+" SET crack = '1' WHERE plink = '"+result.rows[i].plink+"'");
				}
			}
		});
	});
}

function add3(tableCr, tableKey){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query(" SELECT * FROM "+tableCr+" WHERE crack != '2' AND crack != '3' ", function(err, result){
			done();
			if(err){
				return console.error("Truy vấn lỗi!");
			}
			if(result.rowCount == 0){
				console.log("Không có dữ liệu mới để thêm cho key 3!");
			}else{
				for(var i = 0; i < result.rowCount; i++){
					tach3(result.rows[i].vatit+" ", result.rows[i].plink, tableKey);
					client.query("UPDATE "+tableCr+" SET crack = '2' WHERE plink = '"+result.rows[i].plink+"'");
				}
			}
		});
	});
}

function add4(tableCr, tableKey){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query(" SELECT * FROM "+tableCr+" WHERE  crack != '3'", function(err, result){
			done();
			if(err){
				return console.error("Truy vấn lỗi!");
			}
			if(result.rowCount == 0){
				console.log("Không có dữ liệu mới để thêm cho key 4!");
			}else{
				for(var i = 0; i < result.rowCount; i++){
					tach4(result.rows[i].vatit+" ", result.rows[i].plink, tableKey);
					client.query("UPDATE "+tableCr+" SET crack = '3' WHERE plink = '"+result.rows[i].plink+"'");
				}
			}
		});
	});
}




//Tach 2 tu
function tach2(txt,link, tableKey){
	var tu, sotu = 0, temp = 0;
	var i = 0;
	while (i <= txt.length-1) {
		if(txt[i] == " " && sotu == 0){
			tu  = txt.substring(0,i);
			temp = i+1;
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu == 1){
			tu = txt.substring(0,i);
			pool.connect(function(err, client, done){
				if(err){
					return console.err('Error fetching client from pool', err);
				}
				client.query("INSERT INTO "+tableKey+"(val, plink, type) VALUES('"+tu+"','"+link+"','"+0+"')", function(err, result){
					done();
					if(err){
						return console.error("Truy vấn lỗi!");
					}
				});
			});
			// console.log(tu);
			sotu = 0;
			tach2(txt.substring(temp,txt.length), link, tableKey);
			break;
		}
		i++;
	}
}


// Tach 3 tu
function tach3(txt,link, tableKey){
	var tu, sotu = 0, temp = 0;
	var i = 0;
	while (i <= txt.length-1) {
		if(txt[i] == " " && sotu < 1){
			tu  = txt.substring(0,i);
			temp = i+1;
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu < 2){
			tu  = txt.substring(0,i);
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu == 2){
			tu = txt.substring(0,i);
			pool.connect(function(err, client, done){
				if(err){
					return console.err('Error fetching client from pool', err);
				}
				client.query("INSERT INTO "+tableKey+"(val, plink, type) VALUES('"+tu+"','"+link+"','"+0+"')", function(err, result){
					done();
					if(err){
						return console.error("Truy vấn lỗi!");
					}
				});
			});
			// console.log(tu);
			sotu = 0;
			// txt = txt.substring(i+1,txt.length);
			tach3(txt.substring(temp,txt.length),link, tableKey);
			break;
		}
		i++;
	}
} 

//Tach 4 tu
function tach4(txt,link, tableKey){
	var tu, sotu = 0, temp = 0;
	var i = 0;
	while (i <= txt.length-1) {
		if(txt[i] == " " && sotu < 1){
			tu  = txt.substring(0,i);
			temp = i+1;
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu < 2){
			tu  = txt.substring(0,i);
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu < 3){
			tu  = txt.substring(0,i);
			sotu = sotu + 1;
		}else if(txt[i] == " " && sotu == 3){
			tu = txt.substring(0,i);
			pool.connect(function(err, client, done){
				if(err){
					return console.err('Error fetching client from pool', err);
				}
				client.query("INSERT INTO "+tableKey+"(val, plink, type) VALUES('"+tu+"','"+link+"','"+0+"')", function(err, result){
					done();
					if(err){
						return console.error("Truy vấn lỗi!");
					}
				});
			});
			// console.log(tu);
			sotu = 0;
			// txt = txt.substring(i+1,txt.length);
			tach4(txt.substring(temp,txt.length),link, tableKey);
			break;
		}
		i++;
	}
} 
//Control key2
app.get("/controlkey2", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		const data = await client.query("SELECT DISTINCT val FROM key2_data WHERE val IN (SELECT val FROM key2_data GROUP BY val HAVING COUNT(val) >= 3 )");

		res.render("controlkey2", {data:data});
	});
});

app.get("/controlkey2/:val", function(req, res){
	var val = req.params.val;
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query("DELETE FROM key2_data WHERE val = '"+val+"'");
		res.redirect("/controlkey2");
	});
});

//Control key3
app.get("/controlkey3", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		const data = await client.query("SELECT DISTINCT val FROM key3_data WHERE val IN (SELECT val FROM key3_data GROUP BY val HAVING COUNT(val) >= 3 )");
		res.render("controlkey3", {data:data});
	});
});

app.get("/controlkey3/:val", function(req, res){
	var val = req.params.val;
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query("DELETE FROM key3_data WHERE val = '"+val+"'");
		res.redirect("/controlkey3");
	});
});

//Control key4
app.get("/controlkey4", function(req, res){
	pool.connect(async function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		const data = await client.query("SELECT DISTINCT val FROM key4_data WHERE val IN (SELECT val FROM key4_data GROUP BY val HAVING COUNT(val) >= 3 )");
		res.render("controlkey4", {data:data});
	});
});

app.get("/controlkey4/:val", function(req, res){
	var val = req.params.val;
	pool.connect(function(err, client, done){
		if(err){
			return console.err('Error fetching client from pool', err);
		}
		client.query("DELETE FROM key2_data WHERE val = '"+val+"'");
		res.redirect("/controlkey4");
	});
});



app.get("/404", function(req, res){
	res.render("404");
});



