# ProUML

## Todo List

### Backend

#### Transpiler

##### Add

- [ ] Generate layout based on relations (project)
  - [ ] Generate class box size
  - [ ] Create an array that is sorted by least amount of relations first
  - [ ] Create 2d array to find shortest path of class relations

##### Change

##### Fix

### Frontend

##### Add

- [ ] Add WebSocket Ping Pong

##### Change

##### Fix

## UML Relations

### Java

#### Association

```java
class Engine {}
public class Car {
  private Engine engine;

  public Car() {
    engine = new Engine();
  }
}
```

#### Dependency

```java
class Engine {}
public class Car {
  public Car() {
    Engine engine = new Engine();
  }
}
```

```java
class Engine {}
public class Car {
  public Car(Engine engine) {
  }
}
```

#### Realization

```java
interface CarIF {}
public class Car implements CarIF {}
```

#### Generalization

```java
abstract class Car {}
public class IS300 extends Car {}
```
