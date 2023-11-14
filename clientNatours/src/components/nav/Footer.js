export default function Footer() {
  return (
    <div className="text-center p-1 bg-warning text-light mt-1">
      <h5 className="mt-1">Tourist App - Buy or Rent Properties</h5>
      <p className="mt-1">
        &copy; {new Date().getFullYear()} All rights reserved
      </p>
    </div>
  );
}