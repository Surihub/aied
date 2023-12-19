from pyodide.ffi import to_js
from pyscript import when, window, document
from js import Math, THREE, performance, Object
import asyncio
from js import initializePhysics

# Call the JavaScript function to initialize the physics world
physics_world = initializePhysics()


mouse = THREE.Vector2.new()

renderer = THREE.WebGLRenderer.new({"antialias": True})
renderer.setSize(1000, 1000)
renderer.shadowMap.enabled = False
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.needsUpdate = True

document.body.appendChild(renderer.domElement)

@when("mousemove", "body")
def onMouseMove(event):
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

camera = THREE.PerspectiveCamera.new(35, window.innerWidth / window.innerHeight, 1, 500)
scene = THREE.Scene.new()
cameraRange = 2

camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize( window.innerWidth, window.innerHeight )

setcolor = "#000000"

scene.background = THREE.Color.new(setcolor)
scene.fog = THREE.Fog.new(setcolor, 2.5, 3.5)

sceneGroup = THREE.Object3D.new()
particularGroup = THREE.Object3D.new()

def mathRandom(num = 1):
    setNumber = - Math.random() * num + Math.random() * num
    return setNumber

particularGroup =  THREE.Object3D.new()
modularGroup =  THREE.Object3D.new()

perms = {"flatShading":True, "color":"#111111", "transparent":False, "opacity":1, "wireframe":False}
perms = Object.fromEntries(to_js(perms))

particle_perms = {"color":"#FFFFFF", "side":THREE.DoubleSide}
particle_perms = Object.fromEntries(to_js(particle_perms))

def create_cubes(mathRandom, modularGroup):
    i = 0
    while i < 10:
        geometry = THREE.IcosahedronGeometry.new()
        material = THREE.MeshStandardMaterial.new(perms)
        cube = THREE.Mesh.new(geometry, material)
        cube.speedRotation = Math.random() * 0.1
        cube.positionX = mathRandom()
        cube.positionY = mathRandom()
        cube.positionZ = mathRandom()
        cube.castShadow = True
        cube.receiveShadow = True
        newScaleValue = mathRandom(0.3)
        cube.scale.set(newScaleValue,newScaleValue,newScaleValue)
        cube.rotation.x = mathRandom(180 * Math.PI / 180)
        cube.rotation.y = mathRandom(180 * Math.PI / 180)
        cube.rotation.z = mathRandom(180 * Math.PI / 180)
        cube.position.set(cube.positionX, cube.positionY, cube.positionZ)
        modularGroup.add(cube)
        i += 1

create_cubes(mathRandom, modularGroup)


def generateParticle(mathRandom, particularGroup, num, amp = 2):
    gmaterial = THREE.MeshPhysicalMaterial.new(particle_perms)
    gparticular = THREE.CircleGeometry.new(0.2,5)
    i = 0
    while i < num:
        pscale = 0.001+Math.abs(mathRandom(0.03))
        particular = THREE.Mesh.new(gparticular, gmaterial)
        particular.position.set(mathRandom(amp),mathRandom(amp),mathRandom(amp))
        particular.rotation.set(mathRandom(),mathRandom(),mathRandom())
        particular.scale.set(pscale,pscale,pscale)
        particular.speedValue = mathRandom(1)
        particularGroup.add(particular)
        i += 1

generateParticle(mathRandom, particularGroup, 200, 2)

sceneGroup.add(particularGroup)
scene.add(modularGroup)
scene.add(sceneGroup)

camera.position.set(0, 0, cameraRange)
cameraValue = False

ambientLight = THREE.AmbientLight.new(0xFFFFFF, 0.1)

light = THREE.SpotLight.new(0xFFFFFF, 3)
light.position.set(5, 5, 2)
light.castShadow = True
light.shadow.mapSize.width = 10000
light.shadow.mapSize.height = light.shadow.mapSize.width
light.penumbra = 0.5

lightBack = THREE.PointLight.new(0x0FFFFF, 1)
lightBack.position.set(0, -3, -1)

scene.add(sceneGroup)
scene.add(light)
scene.add(lightBack)

rectSize = 2
intensity = 14
rectLight = THREE.RectAreaLight.new( 0x0FFFFF, intensity,  rectSize, rectSize )
rectLight.position.set( 0, 0, 1 )
rectLight.lookAt( 0, 0, 0 )
scene.add(rectLight)

raycaster = THREE.Raycaster.new()
uSpeed = 0.1

time = 0.0003
camera.lookAt(scene.position)

async def main():
    while True:
        time = performance.now() * 0.0003
        i = 0
        while i < particularGroup.children.length:
            newObject = particularGroup.children[i]
            newObject.rotation.x += newObject.speedValue/10
            newObject.rotation.y += newObject.speedValue/10
            newObject.rotation.z += newObject.speedValue/10
            i += 1

        i = 0
        while i < modularGroup.children.length:
            newCubes = modularGroup.children[i]
            newCubes.rotation.x += 0.008
            newCubes.rotation.y += 0.005
            newCubes.rotation.z += 0.003

            newCubes.position.x = Math.sin(time * newCubes.positionZ) * newCubes.positionY
            newCubes.position.y = Math.cos(time * newCubes.positionX) * newCubes.positionZ
            newCubes.position.z = Math.sin(time * newCubes.positionY) * newCubes.positionX
            i += 1

        particularGroup.rotation.y += 0.005

        modularGroup.rotation.y -= ((mouse.x * 4) + modularGroup.rotation.y) * uSpeed
        modularGroup.rotation.x -= ((-mouse.y * 4) + modularGroup.rotation.x) * uSpeed

        renderer.render( scene, camera )
        await asyncio.sleep(0.02)

asyncio.ensure_future(main())

def create_shapes(mathRandom, modularGroup):
    geometries = [
        THREE.TetrahedronGeometry.new(), # Tetrahedron
        THREE.BoxGeometry.new(1, 1, 1), # Cube
        THREE.OctahedronGeometry.new(), # Octahedron
        THREE.DodecahedronGeometry.new(), # Dodecahedron
        THREE.IcosahedronGeometry.new() # Icosahedron
    ]

    i = 0
    while i < 30:
        geometry = geometries[Math.floor(Math.random() * len(geometries))] # Randomly select a geometry
        material = THREE.MeshStandardMaterial.new(perms)
        shape = THREE.Mesh.new(geometry, material)
        shape.speedRotation = Math.random() * 0.1
        shape.positionX = mathRandom()
        shape.positionY = mathRandom()
        shape.positionZ = mathRandom()
        shape.castShadow = True
        shape.receiveShadow = True
        newScaleValue = mathRandom(0.3)
        shape.scale.set(newScaleValue,newScaleValue,newScaleValue)
        shape.rotation.x = mathRandom(180 * Math.PI / 180)
        shape.rotation.y = mathRandom(180 * Math.PI / 180)
        shape.rotation.z = mathRandom(180 * Math.PI / 180)
        shape.position.set(shape.positionX, shape.positionY, shape.positionZ)
        modularGroup.add(shape)
        i += 1

create_shapes(mathRandom, modularGroup)

# Your existing imports and setup

# Initialize the physics world
world = cannon.World()
world.gravity.set(0, -9.82, 0)  # Setting gravity in the world

# Function to create physics bodies for each shape
def createPhysicsBody(shape, shapeType):
    body = cannon.Body({"mass": 1})  # Mass of 1 for dynamic bodies
    if shapeType == "cube":
        body.addShape(cannon.Box(cannon.Vec3(0.5, 0.5, 0.5)))
    elif shapeType == "sphere":
        body.addShape(cannon.Sphere(0.5))
    # Add other shapes as needed

    body.position.set(shape.position.x, shape.position.y, shape.position.z)
    world.addBody(body)
    return body

# Modify your shape creation function to create corresponding physics bodies
def create_shapes(mathRandom, modularGroup):
    geometries = [
        ("tetrahedron", THREE.TetrahedronGeometry.new()),  # Shape type and geometry
        ("cube", THREE.BoxGeometry.new(1, 1, 1)),
        ("octahedron", THREE.OctahedronGeometry.new()),
        # Add other geometries
    ]

    i = 0
    while i < 30:
        shapeType, geometry = geometries[Math.floor(Math.random() * len(geometries))]
        material = THREE.MeshStandardMaterial.new(perms)
        shape = THREE.Mesh.new(geometry, material)
        # Set shape properties as before
        # ...

        # Create and store the corresponding physics body
        shape.userData.physicsBody = createPhysicsBody(shape, shapeType)

        modularGroup.add(shape)
        i += 1

create_shapes(mathRandom, modularGroup)

# Modify your main function to include physics updates
async def main():
    while True:
        world.step(1/60)  # Step the physics world

        # Update Three.js objects' positions and rotations
        for shape in modularGroup.children:
            body = shape.userData.physicsBody
            shape.position.copy(body.position)
            shape.quaternion.copy(body.quaternion)

        # Rest of your rendering loop
        # ...

asyncio.ensure_future(main())
