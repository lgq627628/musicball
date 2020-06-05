import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallCtrl')
export class BallCtrl extends Component {

    private g: number = -15
    private vx: number = 0
    private vy: number = 0
    private vz: number = -20
    private jumpTime: number = 0
    private isJumping: boolean = false
    private passTime: number = 0
    private endCb: Function = null

    @property(Node)
    camera: Node = null
    private offsetZ: number = 0

    start() {
      this.offsetZ = this.camera.getWorldPosition().z - this.node.getWorldPosition().z
    }

    jumpTo(dst: Vec3, endCb: Function) {
      if (this.isJumping) return
      let src = this.node.getWorldPosition()
      let t = (dst.z - src.z) / this.vz
      if (t <= 0) return
      this.vx = (dst.x - src.x) / t
      this.vy = - this.g * t / 2
      this.jumpTime = t
      this.passTime = 0
      this.isJumping = true
      this.endCb = endCb
    }

    update (dt: number) {
      if (!this.isJumping) return
      this.passTime += dt
      if (this.passTime > this.jumpTime) {
        dt -= (this.passTime - this.jumpTime)
      }
      let pos = this.node.getWorldPosition()
      pos.x += this.vx * dt
      pos.y += (this.vy * dt + this.g * dt * dt / 2)
      pos.z += this.vz * dt
      this.vy += this.g * dt
      this.node.setWorldPosition(pos)
      if (this.passTime >= this.jumpTime) { // 该点已经跳跃完毕
        this.isJumping = false
        this.endCb && this.endCb()
      }
    }

    lateUpdate() {
      if (!this.camera) return
      let pos = this.camera.getWorldPosition()
      pos.z = this.node.worldPosition.z + this.offsetZ
      this.camera.setWorldPosition(pos)
    }
}
