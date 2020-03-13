
IntializePaging = function (params) {

    let pagingModel = {
        TotalCount: 0,
        TotalPage: 0,
        PageNo: 1,
        PageSize: 10,
        current: { PageNo: 1, StartNo: 1, EndNo: 10, Previous: 0, Next: 2, RecordsFrom: 1, RecordsTo: 10 }
    };

    let pageNo = params.pageNumuber === undefined ? 1 : params.pageNumuber;

    pagingModel.PageSize = params.perPageRow === undefined ? 10 : params.perPageRow;
    let liTagClass = "page-item";
    let anchorTagClass = "page-link";
    let dataTable = null;
    RetriveApiResponse = function (pageNumber) {
        try {
            let table = createTableElement();
            let request;
            if (window.XMLHttpRequest) {
                // code for modern browsers
                request = new XMLHttpRequest();
            } else {
                // code for old IE browsers
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            request.open('POST', params.Url);
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Accept", "application/json");
            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    if (response !== undefined && response.result !== undefined && response.result.data !== undefined && response.result.totalCount !== undefined && response.result.totalCount > 0) {
                        pagingModel.TotalCount = response.result.totalCount;
                         createTableBodyElement(response, table);
                        CreatePaging(pageNumber);

                    }
                    //return (data);
                }
            };
            let companyRequest = { PageNo: pageNumber, PageSize: pagingModel.PageSize, SearchText: params.SearchText };
            request.send(JSON.stringify(companyRequest));

        } catch (e) {
            console.log(e);
            return null;
        }
    };

    createTableElement = function () {
        if (params !== undefined && params.Columns !== undefined) {
            let tr = document.createElement("tr");
            for (let i = 0; i < params.Columns.length; i++) {
                let th = document.createElement("th");
                th.innerHTML = params.Columns[i].label;
                th.dataset.name = params.Columns[i].label;
                tr.appendChild(th);
            }
            let thead = document.createElement("thead");
            thead.appendChild(tr);
            dataTable = document.createElement("table");
            dataTable.className = "dataTable";
            dataTable.append(thead);
           
        }
    };
    createTableBodyElement = function (res) {

        if (params !== undefined && params.Columns !== undefined) {
            let data = res.result.data;
            let tbody = createHtmlElement("tbody", "");
            if (data !== undefined && data.length > 0) {
                for (let i = 0; i < data.length; i++) {


                    let tr = document.createElement("tr");
                    for (let c = 0; c < params.Columns.length; c++) {
                        let value = data[i][params.Columns[c].column];
                        let td = document.createElement("td");
                        td.dataset.name = value;
                        if (params.Columns[c].template === "") {
                            td.innerHTML = value;
                            
                        }
                        else {
                            let template = params.Columns[c].template.replace("[id]", value);
                            td.innerHTML =template.replace("[id]", value);
                        }
                        tr.appendChild(td);
                    }

                    tbody.appendChild(tr);
                }
            }
            else {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = "data not found.";
                td.dataset.name = "0";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            dataTable.appendChild(tbody);
           
        }
       
    };
    createHtmlElement = function (tagName, classNames, childTags) {
        let element = document.createElement(tagName);
        element.className = classNames === undefined ? "" : classNames;
        if (childTags !== undefined) {
            element.appendChild(childTags);
        }
        return element;
    };
    createUpperTag = function (tagName, classNames, childTags) {
        let element = document.createElement(tagName);
        element.className = classNames === undefined ? "" : classNames;
        if (childTags !== undefined) {
            element.appendChild(childTags);
        }
        return element;
    };
    createInnerTag = function (tagName, dataset, title, classNames) {
        let element = document.createElement(tagName);
        element.className = classNames === undefined ? "" : classNames;
        element.title = title;
        element.dataset.page = dataset;
        element.innerText = title;
        return element;
    };
    PreviousButtonHtml = function (ul) {
        let firstanchor = this.createInnerTag("a", 1, "First", anchorTagClass);
        let previousanchor = this.createInnerTag("a", pagingModel.current.Previous, "Previous", anchorTagClass);
        let firstli = this.createUpperTag("li", liTagClass, firstanchor);
        let previousli = this.createUpperTag("li", liTagClass, previousanchor);
        if (pagingModel.current.PageNo > 1) {
            firstli.addEventListener("click", function () {
                RetriveApiResponse(1);
            }, false);
            previousli.addEventListener("click", function () {
                RetriveApiResponse(pagingModel.current.Previous);
            }, false);
        }

        ul.appendChild(firstli);
        ul.appendChild(previousli);
        return ul;

    };
    PagingButtonHtml = function (ul) {
        for (let index = pagingModel.current.StartNo; index <= pagingModel.current.EndNo; index++) {
            let anchor = this.createInnerTag("a", index, index, anchorTagClass);
            let li = this.createUpperTag("li", liTagClass + (index === pagingModel.current.PageNo ? " active" : ""), anchor);
            li.addEventListener("click", function (e) {
                RetriveApiResponse(index);
            }, false);

            ul.appendChild(li);
        }
        return ul;
    };
    NextButtonHtml = function (ul) {
        let nextanchor = this.createInnerTag("a", pagingModel.current.Next, "Next", anchorTagClass);
        let lastanchor = this.createInnerTag("a", pagingModel.TotalPage, "Last", anchorTagClass);
        let nextli = this.createUpperTag("li", liTagClass, nextanchor);
        let lastli = this.createUpperTag("li", liTagClass, lastanchor);
        if (pagingModel.PageNo === pagingModel.TotalPage) {
            console.log("");
        }
        else {
            nextli.addEventListener("click", function (e) {
                RetriveApiResponse(pagingModel.current.Next);
            }, false);
            lastli.addEventListener("click", function (e) {
                RetriveApiResponse(pagingModel.TotalPage);
            }, false);
        }

        ul.appendChild(nextli);
        ul.appendChild(lastli);
        return ul;


    };
    RecordInfoHtml = function (ul) {
        let msg = `Displaying ${pagingModel.current.RecordsFrom} to ${pagingModel.current.RecordsTo} of ${pagingModel.TotalCount} records`;
        let anchor = this.createInnerTag("a", msg, msg, anchorTagClass);
        let li = this.createUpperTag("li", liTagClass, anchor);
        ul.appendChild(li);
        return ul;
    };

    CreatePaging = function (PageNo) {

        let offsetFrom = (PageNo - 1) * 10;
        let recordsFrom = offsetFrom + 1;
        let recordsTo = PageNo * pagingModel.PageSize;
        if (recordsTo > pagingModel.TotalCount) {
            recordsTo = pagingModel.TotalCount;
        }
        let TotalPage = parseInt(pagingModel.TotalCount / pagingModel.PageSize);

        if (pagingModel.TotalCount % pagingModel.PageSize > 0) {
            TotalPage = parseInt(pagingModel.TotalCount / pagingModel.PageSize) + 1;
        }
        pagingModel.TotalPage = TotalPage;
        pagingModel.current.PageNo = PageNo;

        pagingModel.current.StartNo = 1;
        if (PageNo > 1) {

            pagingModel.current.EndNo++;

            if (pagingModel.current.EndNo >= TotalPage || PageNo === TotalPage) {
                pagingModel.current.EndNo = TotalPage;
                if (PageNo === TotalPage) {
                    pagingModel.PageNo = TotalPage - (pagingModel.PageSize - 1) > 1 ? TotalPage - (pagingModel.PageSize - 1) : 1;
                }
            }

            if (pagingModel.current.EndNo - PageNo === (pagingModel.PageSize - 1)) {
                pagingModel.current.StartNo = PageNo;
                pagingModel.PageNo = PageNo;
            }
            else {

                pagingModel.current.StartNo = pagingModel.PageNo;
            }

        }
        else {
            pagingModel.current.StartNo = 1;
            pagingModel.PageNo = PageNo;
            if (pagingModel.PageSize < TotalPage) {
                pagingModel.current.EndNo = pagingModel.PageSize;
            }
            else {
                pagingModel.current.EndNo = TotalPage;
            }
        }

        let prePageNo = PageNo > 1 ? PageNo - 1 : 1;
        let nextPageNo = PageNo < TotalPage ? PageNo + 1 : 1;
        pagingModel.current.Previous = prePageNo;
        pagingModel.current.Next = nextPageNo;
        pagingModel.current.RecordsFrom = recordsFrom;
        pagingModel.current.RecordsTo = recordsTo;


        let ul = this.createHtmlElement("ul", "pagination");
        this.PreviousButtonHtml(ul);
        this.PagingButtonHtml(ul);
        this.NextButtonHtml(ul);
        this.RecordInfoHtml(ul);
        let nav = this.createHtmlElement("nav", "Page navigation example", ul);
        let section = this.createHtmlElement("section", "section-preview", nav);

        let tr = this.createHtmlElement("tr", "");
        let td = this.createHtmlElement("td", "");
        td.colSpan  = params !== undefined && params.Columns !== undefined ? params.Columns.length : 1;
        td.appendChild(section);
        tr.appendChild(td);
        let tfoot = this.createHtmlElement("tfoot", "");
        tfoot.appendChild(tr);
        dataTable.appendChild(tfoot);
        document.getElementById(params.SelectorId).innerHTML = "";
        document.getElementById(params.SelectorId).appendChild(dataTable);
    };
    //this.CreatePaging(pageNo);
    RetriveApiResponse(pageNo);
};

/*
 rowNo: 1
id: 5120
companyName: "Techahead Software"
registeredName: "TA"
address: "48-D, Pocket F, Mayur Vihar Phase 2"
countryId: 1
stateId: 1
cityId: 1
pincode: 110091
phone1: "+919811849917"
phone2: "+919811849917"
email: "sunilmalhotramca@gmail.com"
 */
let columns = [
    {
        label: "No",
        column: "rowNo",
        template: ""
    },
    {
        label: "Company Name",
        column: "companyName",
        template: ""
    },
    {
        label: "Phone",
        column: "phone1",
        template: ""
    },
    {
        label: "Email-Id",
        column: "email",
        template: ""
    },
    {
        label: "Action",
        column: "id",
        template: `<a class='btn btn-xs btn-info' data='[id]'><i class='fa fa-eye'></i> View</a> <a class= 'btn btn-xs btn-warning' data='[id]' > <i class='fa fa-pencil'></i> Edit</a>`
    }];
let req = { Url: "http://localhost:53927/api/companyservice/list", CompanyType: 0, SearchText: "", SelectorId: "paging", Columns: columns };
IntializePaging(req);
