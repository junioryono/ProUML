# ProUML

## Todo List

### Backend

#### Transpiler

##### Add

- [ ] Get all declaration types inside method functionality (file)
- [ ] Finish test cases for class associations (file)
- [ ] Relate classes (project)
  - [ ] Check parent class types to find relation
- [ ] Generate layout based on relations (project)
  - [ ] Generate class box size
  - [ ] Create an array that is sorted by least amount of relations first
  - [ ] Create 2d array to find shortest path of class relations

##### Change

##### Fix

### Frontend

#### Architecture

##### Add

##### Change

- [ ] Separate frontend/backend
- [ ] Move to a Next.js/Vercel setup
- [ ] Move backend to a serverless setup

##### Fix

## UML Relations

### Java

#### Association

```java
class Engine {}
public class Car {
  public Car() {
    engine = new Engine();
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
