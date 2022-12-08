
function vue_init(){
		var list = new Vue({
			el: "#list",
			methods: {
				gopage(idx){
					goto_page(idx);
				}
			}
		});
	}
	