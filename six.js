// 六爻

/**
 * 64卦对应的名字
 * 规律：对角线为八纯卦，每行都包含同一个八宫的专有名词
 */
export const GuaName = [
    '坤为地', '地雷复', '地水师', '地泽临', '地山谦', '地火明夷', '地风升', '地天泰',
    '雷地豫', '震为雷', '雷水解', '雷泽归妹', '雷山小过', '雷火丰', '雷风恒', '雷天大壮',
    '水地比', '水雷屯', '坎为水', '水泽节', '水山蹇', '水火既济', '水风井', '水天需',
    '泽地萃', '泽雷随', '泽水困', '兑为泽', '泽山咸', '泽火革', '泽风大过', '泽天夬',
    '山地剥', '山雷颐', '山水蒙', '山泽损', '艮为山', '山火贲', '山风蛊', '山天大畜',
    '火地晋', '火雷噬嗑', '火水未济', '火泽睽', '火山旅', '离为火', '火风鼎', '火天大有',
    '风地观', '风雷益', '风水涣', '风泽中孚', '风山渐', '风火家人', '巽为风', '风天小畜',
    '天地否', '天雷无妄', '天水讼', '天泽履', '天山遁', '天火同人', '天风姤', '乾为天',
];

const GuaGong  = [0,0,2,0,3,2,1,0,1,1,1,3,3,2,1,0,0,2,2,2,3,2,1,0,3,1,3,3,3,2,1,0,7,6,5,4,4,4,6,4,7,6,5,4,5,5,5,7,7,6,5,4,4,6,6,6,7,6,5,4,7,5,7,7];
const GuaXiang = [0,1,7,2,5,6,4,3,1,0,2,7,6,5,3,4,7,2,0,1,4,3,5,6,2,7,1,0,3,4,6,5,5,6,4,3,0,1,7,2,6,5,3,4,1,0,2,7,4,3,5,6,7,2,0,1,3,4,6,5,2,7,1,0];

/**
 * 先天八卦对应的五行索引
 */
const Gong2Element = [3, 1, 0, 4, 3, 2, 1, 4];

/**
 * 象中的世爻位置(应爻位置在[世爻位置 + 3] % 6)
 */
const Xiang4Yao = [5, 0, 1, 2, 3, 4, 3, 2];

/**
 * 卦的地支
 */
const GuaZ = [
    // 为内卦地支  // 为外挂地支
    [[7,  5,  3], [1, 11,   9]], // 坤
    [[0,  2,  4], [6,  8,  10]], // 震
    [[2,  4,  6], [8, 10,   0]], // 坎
    [[5,  3,  1], [11, 9,   7]], // 兑
    [[4,  6,  8], [10, 0,   2]], // 艮
    [[3,  1, 11], [9,  7,   5]], // 离
    [[1, 11,  9], [7,  5,   3]], // 巽
    [[0,  2,  4], [6,  8,  10]], // 乾
];

/**
 * 卦的六亲(依次对应印比伤才杀)
 */
export const Relations = ['父', '兄', '子', '才', '官'];


/**
 * 六兽起点，分别从甲乙丙丁...依次对应
 */
const AnimalStart = [0,0,1,1,2,3,4,4,5,5];

/**
 * 六兽
 */
export const Animals = ['青', '朱', '勾', '蛇', '白', '玄'];


export const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const Element = ['水', '木', '火', '土', '金'];

export class Attr {
    constructor() {
        /**
         * @type {number} 地支
         */
        this.z = undefined

        /**
         * @type {number} 六亲
         */
        this.relation = undefined

        /**
         * @type {number} 旬空(0无，1有)
         */
        this.empty = 0

        /**
         * @type {number} 0无/1-月建/2-月破
         */
        this.m = 0

        /**
         * @type {number} 0无/1-暗动
         */
        this.d = 0
    }
}

export class Yao extends Attr {
    constructor(no, type) {
        super();
        /**
         * @type {number} 六爻编号n，0～5
         */
        this.no = no;

        /**
         * @type {number} 六爻数据 0阴爻 1阳爻 2动阴爻 3动阳爻
         */
        this.type = type;

        /**
         * @type {number} 世/应爻内容 0无 1应 2世
         */
        this.sy = 0;

        /**
         * @type {number} 六兽
         */
        this.animal = undefined;

        /**
         * @type {*[]}
         */
        this.peace = [];


        /**
         * @type {Attr}
         */
        this.change = type > 1 ? new Attr() : undefined;
    }
}

export class Six {
    /**
     * @param times {number[]} 六爻值
     * @param month {number[]} 月柱
     * @param day {number[]} 日柱
     */
    constructor(times, month, day) {
        /**
         * @type {Yao[]}
         */
        this.times = []
        for (let i = 0; i < 6; i++) {
            this.times[i] = new Yao(i, times[i])
        }
        this.month = month
        this.day = day

        /**
         * @type {number} 前卦
         */
        this.front = undefined
        /**
         * @type {number} 后卦
         */
        this.back = undefined
        /**
         * @type {number} 五行
         */
        this.element = undefined

        this.#recognize()
        this.#load()
    }

    names()
    {
        return this.back === undefined ? [GuaName[this.front]] : [GuaName[this.front], GuaName[this.back]]
    }

    #recognize() {
        let f = 0b000000
        let b = 0b000000

        const dynamic = this.times.reduce((p, c) => {
            switch (c.type) {
                case 1:
                    f = f | 1 << c.no;
                    b = b | 1 << c.no;
                    break;
                case 2:
                    b = b | 1 << c.no;
                    break;
                case 3:
                    f = f | 1 << c.no;
            }
            return p || c.type > 1
        }, false)

        this.front = f;
        this.back = dynamic ? b : undefined
    }

    #load() {
        const g = GuaGong[this.front]
        this.element = Gong2Element[g]
        this.#loadZhi()
        this.#loadSY()
        this.#loadRelation()
        this.#loadAnimals()
        this.#loadEmpty()
        this.#loadJPD()
        this.#loadDefect(g)
    }

    /**
     * 装卦的地支
     */
    #loadZhi() {
        // 装前卦
        let out = this.front >> 3;
        let inside = this.front & 0b000111;

        let i = GuaZ[inside][0];
        let o = GuaZ[out][1];

        let gz = [...i, ...o];

        this.times.forEach((y) => {
            y.z = gz[y.no]
        })

        if (this.back !== undefined) { // 装后卦
            out = this.back >> 3;
            inside = this.back & 0b000111;

            i = GuaZ[inside][0];
            o = GuaZ[out][1];

            gz = [...i, ...o];
            this.times.forEach((y) => {
                if (y.change) {
                    y.change.z = gz[y.no]
                }
            })
        }
    }

    /**
     * 装卦世应
     */
    #loadSY() {
        const x = GuaXiang[this.front];

        const a = Xiang4Yao[x];
        const b = (a + 3) % 6;

        this.times[a].sy = 2;
        this.times[b].sy = 1;
    }

    /**
     * 装卦六亲
     */
    #loadRelation() {
        this.times.forEach((y) => {
            y.relation = this.#spirit(this.element, this.#z2e(y.z))
            if (y.change) {
                y.change.relation = this.#spirit(this.element, this.#z2e(y.change.z))
            }
        })
    }

    /**
     * 装卦六兽
     */
    #loadAnimals() {
        let start = AnimalStart[this.day[0]];

        this.times.forEach((y) => {
            y.animal = start % 6
            start++
        })
    }

    /**
     * 装卦旬空
     */
    #loadEmpty() {
        const s = 9 - this.day[0] + this.day[1];
        const kong = [(s + 1) % 12, (s + 2) % 12];

        this.times.forEach((y) => {
            if (kong.indexOf(y.z) > -1) {
                y.empty = 1
            }
            if (y.change) {
                if (kong.indexOf(y.change.z) > -1) {
                    y.change.empty = 1
                }
            }
        })
    }

    /**
     * 装卦建/破/动
     */
    #loadJPD() {
        this.times.forEach((y) => {
            if (y.z === this.month[1]) {
                y.m = 1
            } else if (Math.abs(y.z - this.month[1]) === 6) {
                y.m = 2
            }
            if (Math.abs(y.z - this.day[1]) === 6) {
                y.d = 1
            }
            if (y.change) {
                if (y.change.z === this.month[1]) {
                    y.change.m = 1
                } else if (Math.abs(y.change.z - this.month[1]) === 6) {
                    y.change.m = 2
                }
                if (Math.abs(y.change.z - this.day[1]) === 6) {
                    y.change.d = 1
                }
            }
        })
    }

    /**
     * 修复缺失的六亲(在内外卦都没有，则为缺失六亲)
     * @param gong {number}
     */
    #loadDefect(gong) {
        let exists = 0b00000; // 用二进制表示是否存在对应的六亲，依次为父、兄、子、才、官，默认为不存在
        /** @var Yao $yao */
        this.times.forEach((y) => {
            exists = exists | 1 << y.relation;
            if (y.change) {
                exists = exists | 1 << y.change.relation;
            }
        })
        if (exists !== 0b11111) {
            const GuaZhi = GuaZ[gong].flat(1); // 根据当前卦所在的宫的第一个卦，得到对应的地支
            const relations = GuaZhi.map(z => [z, this.#spirit(this.element, this.#z2e(z))]);

            relations.forEach((r, index) => {
                if (((exists >> r[1]) & 0b00001) === 0) { // 判断当前位置$index的六亲是否已经存在
                    this.times[index].peace = r;
                }
            })
        }
}

    /**
     * 算五神
     * @param ie {number} 我的五行
     * @param oe {number} 其他的五行
     * @returns {number}
     */
    #spirit(ie, oe) {
        return ((6 - ie) % 5 + oe) % 5
    }

    /**
     * 地支对应的五行
     * @param z
     * @returns {number}
     */
    #z2e(z) {
        return [0, 3, 1, 1, 3, 2, 2, 3, 4, 4, 3, 0][z]
    }

    /**
     * 控制台打印
     */
    console() {
        const GP = ['- -', '---', '-x-', '-0-'];

        console.log(Gan[this.month[0]] + Zhi[this.month[1]] + '月' + Gan[this.day[0]] + Zhi[this.day[1]] + '日')
        console.log(this.names().join("之"), Element[this.element])

        for (let i = 5; i >= 0; i--) {
            const yao = this.times[i]
            const sy = ['　', '应', '世'][yao.sy];
            const zhi = Zhi[yao.z];

            const r = Relations[yao.relation];

            let cz, cr
            if (yao.change) {
                cz = Zhi[yao.change.z];
                cr = Relations[yao.change.relation];
            } else {
                cz = '　';
                cr = '　';
            }
            const animal = Animals[yao.animal];

            const empty = ['　', '空'][yao.empty];
            const jp = ['　', '建', '破'][yao.m];
            const fu = yao.peace.length ? '伏' + Zhi[yao.peace[0]] + Relations[yao.peace[1]] : '　　　';


            const No = yao.no + 1;
            console.log(`${No} ${sy} ${animal} ${r} ${GP[yao.type]} ${zhi} [${empty} ${jp} ${fu}] ${cz} ${cr}`)
        }
    }

    stringify() {
        return {

        }
    }

}
