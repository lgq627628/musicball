import { _decorator, Component, Node, instantiate, Vec3 } from 'cc';
import { BallCtrl } from './BallCtrl';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {

    @property(BallCtrl)
    ballCtrl: BallCtrl = null
    @property(Node)
    platRoot: Node = null

    private curIdx: number = 0

    private platPrefab: Node = null

    start () {
      this.platPrefab = instantiate(this.node.getChildByName('start'))
      for(let i=0; i<5; i++) {
        this.genPlat()
      }
      this.jumpToNext()
    }

    genPlat() {
      let plat: Node = instantiate(this.platPrefab)
      let pos: Vec3 = this.platRoot.children[this.platRoot.children.length - 1].getWorldPosition()
      pos.z -= (5 + Math.random() * 15)
      pos.x = (-3 + Math.random() * 6)
      this.platRoot.addChild(plat)
      plat.setWorldPosition(pos)

      // 生成的同时还要删除
      if (this.curIdx > 10) {
        for(let i=0; i<10; i++) {
          this.platRoot.children[0].removeFromParent()
        }
        this.curIdx -= 10
      }
    }

    jumpToNext() {
      if (this.curIdx >= this.platRoot.children.length) return
      let dst = this.platRoot.children[this.curIdx].getWorldPosition()
      dst.y = this.ballCtrl.node.getWorldPosition().y
      this.ballCtrl.jumpTo(dst, () => {
        this.curIdx++
        this.genPlat()
        this.jumpToNext()
      })
    }


}
