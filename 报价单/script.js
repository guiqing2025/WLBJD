// 物料数据
let items = [
    { name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' },
    { name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' }
];

function autoResize(element) {
    if(!element) return;
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

// LOGO上传和处理
function setupLogoUpload() {
    const logo = document.getElementById('logo');
    const logoUpload = document.getElementById('logo-upload');

    // 从localStorage加载保存的logo
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
        logo.src = savedLogo;
    }

    // 点击logo时触发文件上传
    logo.addEventListener('click', () => {
        logoUpload.click();
    });

    // 处理文件上传
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                logo.src = dataUrl;
                localStorage.setItem('companyLogo', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // 设置logo的鼠标样式
    logo.style.cursor = 'pointer';
}

// --- 保存、加载、清空数据 ---
const form = document.getElementById('quotation-form');

function saveData() {
    const dataToSave = {
        fields: {},
        items: items,
        logo: localStorage.getItem('companyLogo')
    };
    const fieldIds = [
        'company-name', 'company-address', 'company-phone', 'company-email',
        'quotation-no', 'quotation-date', 'valid-until', 'currency', 'customer-name',
        'customer-contact', 'customer-phone', 'customer-email', 'customer-address',
        'tax-rate', 'payment-method', 'delivery-time', 'delivery-place', 'transport-method',
        'quotation-remark'
    ];
    fieldIds.forEach(id => {
        if(document.getElementById(id)) dataToSave.fields[id] = document.getElementById(id).value;
    });
    localStorage.setItem('quotationData', JSON.stringify(dataToSave));
}

function loadData() {
    const savedData = localStorage.getItem('quotationData');
    if (savedData) {
        const data = JSON.parse(savedData);
        // 加载保存的数据
        Object.keys(data.fields).forEach(id => {
            if (document.getElementById(id)) {
                document.getElementById(id).value = data.fields[id];
            }
        });
        items = data.items || [{ name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' }];
        if (data.logo) {
            localStorage.setItem('companyLogo', data.logo);
        }
    } else {
        // 如果没有保存的数据，设置默认值
        setDefaultValues();
    }
    renderTable();

    // 触发所有文本框的自动调整
    document.querySelectorAll('textarea.autoresize').forEach(textarea => {
        setTimeout(() => autoResize(textarea), 0);
    });
}

function clearData() {
    if (confirm('您确定要清空所有已保存的数据吗？页面将恢复到初始状态。')) {
        localStorage.removeItem('quotationData');
        setDefaultValues(); // 设置默认值而不是刷新页面
    }
}

// 添加默认值设置函数
function setDefaultValues() {
    // 公司信息
    document.getElementById('company-name').value = '深圳市宝安区贵擎电子';
    document.getElementById('company-address').value = '广东省深圳市南山区前海深港合作区南山街道港城街99号5楼501';
    document.getElementById('company-phone').value = '19068615206';
    document.getElementById('company-email').value = '435629924@qq.com';

    // 客户信息默认为空
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-contact').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('customer-address').value = '';

    // 报价单信息
    const today = new Date();
    const quotationNo = 'GQCX' + today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0') +
        String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    document.getElementById('quotation-no').value = quotationNo;
    
    // 设置报价日期为今天
    const dateStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
    document.getElementById('quotation-date').value = dateStr;
    
    // 设置有效期为30天后
    const validUntil = new Date(today);
    validUntil.setDate(today.getDate() + 30);
    const validUntilStr = validUntil.getFullYear() + '-' + 
        String(validUntil.getMonth() + 1).padStart(2, '0') + '-' + 
        String(validUntil.getDate()).padStart(2, '0');
    document.getElementById('valid-until').value = validUntilStr;

    // 其他默认值
    document.getElementById('currency').value = 'CNY';
    document.getElementById('tax-rate').value = '0.03';
    document.getElementById('payment-method').value = '对公转账';
    document.getElementById('delivery-time').value = '7天内';
    document.getElementById('delivery-place').value = '广东省深圳市宝安区石岩街道石龙社区惠科工业园7栋1层';
    document.getElementById('transport-method').value = '快递/物流';

    // 银行账户信息
    document.getElementById('bank-account-name').textContent = '深圳市宝安区贵擎电子产品服务中心 (个体工商户)';
    document.getElementById('bank-account-number').textContent = '86031110001500874';
    document.getElementById('bank-name').textContent = '宁波银行股份有限公司深圳光明支行';
    document.getElementById('legal-representative').textContent = '郑丽霞';

    // 清空物料列表并添加一个空行
    items = [{ name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' }];
    renderTable();

    // 重置备注
    document.getElementById('quotation-remark').value = '本报价单有效期7天，本次物料是代购，超过7天无理由退货，不予处理！';

    // 保存初始数据
    saveData();
}

// 在页面加载时调用loadData
window.onload = loadData;

form.addEventListener('change', saveData);
window.addEventListener('beforeunload', saveData); // 在页面刷新或关闭前保存数据
document.getElementById('clear-data').onclick = clearData;
document.getElementById('print-page').onclick = () => window.print();

function renderTable() {
    const tbody = document.querySelector('#items-table tbody');
    tbody.innerHTML = '';
    let subtotal = 0;
    const currency = document.getElementById('currency').value;
    const symbol = currency === 'USD' ? '$' : '￥';
    items.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td><textarea class="autoresize" rows="1" oninput="autoResize(this)" onchange="updateItem(${idx}, 'name', this.value)">${item.name}</textarea></td>
            <td><textarea class="autoresize" rows="1" oninput="autoResize(this)" onchange="updateItem(${idx}, 'model', this.value)">${item.model}</textarea></td>
            <td><textarea class="autoresize" rows="1" oninput="autoResize(this)" onchange="updateItem(${idx}, 'unit', this.value)">${item.unit}</textarea></td>
            <td><input type="number" min="0" value="${item.qty}" onchange="updateItem(${idx}, 'qty', this.value)"></td>
            <td><input type="number" min="0" step="0.01" value="${item.price}" onchange="updateItem(${idx}, 'price', this.value)"></td>
            <td>${symbol}${item.amount.toFixed(2)}</td>
            <td><textarea class="autoresize" rows="1" oninput="autoResize(this)" onchange="updateItem(${idx}, 'remark', this.value)">${item.remark || ''}</textarea></td>
            <td><button type="button" class="delete-row" onclick="deleteItem(${idx})">删除</button></td>
        `;
        tbody.appendChild(tr);
        subtotal += item.amount;
    });
    // 计算税额、总计
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    document.getElementById('subtotal-amount').textContent = symbol + subtotal.toFixed(2);
    document.getElementById('tax-amount').textContent = symbol + taxAmount.toFixed(2);
    document.getElementById('total-amount').textContent = symbol + total.toFixed(2);
    document.getElementById('total-amount-cn').textContent = currency === 'USD' ? toChineseMoneyUSD(total) : toChineseMoney(total);

    // Set initial height for new textareas in table
    tbody.querySelectorAll('textarea.autoresize').forEach(textarea => {
        setTimeout(() => autoResize(textarea), 0);
    });
}

function updateItem(idx, key, value) {
    if (key === 'qty' || key === 'price') {
        value = value === '' ? 0 : parseFloat(value);
    }
    items[idx][key] = value;
    // 自动计算金额
    const qty = parseFloat(items[idx].qty) || 0;
    const price = parseFloat(items[idx].price) || 0;
    items[idx].amount = qty * price;
    renderTable();
}

function deleteItem(idx) {
    items.splice(idx, 1);
    if (items.length === 0) items.push({ name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' });
    renderTable();
}

function addItem() {
    items.push({ name: '', model: '', unit: '', qty: '', price: '', amount: 0, remark: '' });
    renderTable();
}

document.getElementById('add-item').onclick = addItem;
document.getElementById('tax-rate').onchange = renderTable;
document.getElementById('currency').onchange = renderTable;
renderTable();

// 金额转大写（人民币）
function toChineseMoney(n) {
    if (!n || isNaN(n)) return '零元整';
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    let head = n < 0 ? '负' : '';
    n = Math.abs(n);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}
// 金额转大写（美元，简单实现）
function toChineseMoneyUSD(n) {
    if (!n || isNaN(n)) return 'Zero Dollars';
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// 导出Excel
function exportExcel() {
    const wb = XLSX.utils.book_new();
    // 表头信息
    const info = [
        ['公司名称', document.getElementById('company-name').value, '公司地址', document.getElementById('company-address').value],
        ['公司电话', document.getElementById('company-phone').value, '公司邮箱', document.getElementById('company-email').value],
        ['客户公司名称', document.getElementById('customer-name').value, '客户联系人', document.getElementById('customer-contact').value],
        ['客户电话', document.getElementById('customer-phone').value, '客户邮箱', document.getElementById('customer-email').value],
        ['客户地址', document.getElementById('customer-address').value, '', ''],
        ['报价单号', document.getElementById('quotation-no').value, '报价日期', document.getElementById('quotation-date').value],
        ['有效期至', document.getElementById('valid-until').value, '币种', document.getElementById('currency').options[document.getElementById('currency').selectedIndex].text],
        ['税率', document.getElementById('tax-rate').options[document.getElementById('tax-rate').selectedIndex].text, '付款方式', document.getElementById('payment-method').value],
        ['交货期', document.getElementById('delivery-time').value, '交货地点', document.getElementById('delivery-place').value],
        ['运输方式', document.getElementById('transport-method').value, '', ''],
    ];
    // 收款信息
    const bank_info = [
        [], // separator
        ['收款账户信息'],
        ['账户名称', document.getElementById('bank-account-name').textContent],
        ['账户号码', document.getElementById('bank-account-number').textContent],
        ['开户银行', document.getElementById('bank-name').textContent],
        ['法定代表人', document.getElementById('legal-representative').textContent]
    ];
    // 物料表
    const ws_data = [
        ...info,
        [],
        ['物料清单'],
        ['序号','物料名称','规格型号','单位','数量','单价','金额','备注'],
        ...items.map((item, idx) => [
            idx + 1,
            item.name,
            item.model,
            item.unit,
            item.qty,
            item.price,
            item.amount.toFixed(2),
            item.remark || ''
        ]),
        [],
        ['小计', document.getElementById('subtotal-amount').textContent],
        ['税额', document.getElementById('tax-amount').textContent],
        ['总计', document.getElementById('total-amount').textContent],
        ['大写', document.getElementById('total-amount-cn').textContent],
        [],
        ['备注', document.getElementById('quotation-remark').value]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const final_ws_data = [
        ...info,
        ...bank_info,
        ...ws_data.slice(info.length)
    ];
    const final_ws = XLSX.utils.aoa_to_sheet(final_ws_data);
    XLSX.utils.book_append_sheet(wb, final_ws, '物料报价单');
    XLSX.writeFile(wb, '物料报价单.xlsx');
}
document.getElementById('export-excel').onclick = exportExcel;

// 确保所有输入框的值都被正确同步
function syncInputValues() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            // 强制触发 change 事件来确保值被更新
            input.dispatchEvent(new Event('change', { bubbles: true }));
            // 确保显示值与实际值同步
            if (input.value) {
                input.setAttribute('value', input.value);
                // 对于textarea，需要设置innerHTML
                if (input.tagName.toLowerCase() === 'textarea') {
                    input.innerHTML = input.value;
                }
            }
        }
    });
}

// 在导出PDF前同步所有数据
async function exportToPDF() {
    try {
        // 先同步所有输入框的值
        syncInputValues();
        
        // 等待一小段时间确保DOM完全更新
        await new Promise(resolve => setTimeout(resolve, 1000));

        const element = document.body;
        
        // 添加打印类以确保正确的样式
        element.classList.add('printing');

        // 创建canvas
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            onclone: function(clonedDoc) {
                // 确保克隆的文档中的输入框值也被同步
                const clonedInputs = clonedDoc.querySelectorAll('input, textarea, select');
                clonedInputs.forEach(input => {
                    if (input.type !== 'button' && input.type !== 'submit') {
                        // 查找原始输入框，使用多个选择器但确保它们都是有效的
                        let originalInput = null;
                        
                        // 通过name查找
                        if (input.name) {
                            originalInput = document.querySelector(`[name="${input.name}"]`);
                        }
                        
                        // 如果没找到且有id，通过id查找
                        if (!originalInput && input.id) {
                            originalInput = document.querySelector(`#${input.id}`);
                        }
                        
                        // 如果还没找到且有data-field，通过data-field查找
                        if (!originalInput && input.dataset.field) {
                            originalInput = document.querySelector(`[data-field="${input.dataset.field}"]`);
                        }
                        
                        if (originalInput) {
                            // 同步值
                            input.value = originalInput.value;
                            input.setAttribute('value', originalInput.value);
                            
                            // 创建一个span来显示值
                            const span = document.createElement('span');
                            span.textContent = originalInput.value || '';
                            span.style.whiteSpace = 'pre-wrap';
                            span.style.wordBreak = 'break-all';
                            span.style.display = 'block';
                            span.style.width = '100%';
                            span.style.minHeight = '20px';
                            span.style.padding = '8px';
                            span.style.border = '1px solid #000';
                            span.style.boxSizing = 'border-box';
                            
                            // 替换输入框
                            input.parentNode.replaceChild(span, input);
                        }
                    }
                });

                // 确保地址等长文本字段正确换行
                const longTextFields = clonedDoc.querySelectorAll('[data-field="公司地址"], [data-field="客户地址"], [data-field="交货地点"]');
                longTextFields.forEach(field => {
                    if (field.tagName.toLowerCase() === 'input') {
                        const div = document.createElement('div');
                        div.textContent = field.value || '';
                        div.style.whiteSpace = 'pre-wrap';
                        div.style.wordBreak = 'break-all';
                        div.style.width = '100%';
                        div.style.minHeight = '20px';
                        div.style.padding = '8px';
                        div.style.border = '1px solid #000';
                        div.style.boxSizing = 'border-box';
                        field.parentNode.replaceChild(div, field);
                    }
                });
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('报价单.pdf');

            // 移除打印类
            element.classList.remove('printing');
        });
    } catch (error) {
        console.error('PDF导出错误:', error);
        alert('PDF导出失败，请重试');
    }
}

// 添加自动保存功能
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            input.addEventListener('change', () => {
                // 保存到localStorage
                const key = input.name || input.id || input.dataset.field;
                if (key) {
                    localStorage.setItem(key, input.value);
                }
            });
            
            // 从localStorage加载保存的值
            const key = input.name || input.id || input.dataset.field;
            if (key) {
                const savedValue = localStorage.getItem(key);
                if (savedValue) {
                    input.value = savedValue;
                    input.setAttribute('value', savedValue);
                }
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    setupLogoUpload();
    setupAutoSave();
});

document.getElementById('export-pdf').onclick = exportToPDF; 